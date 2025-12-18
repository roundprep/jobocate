import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InterviewSession,
  InterviewSessionDocument,
  InterviewMode,
  InterviewStatus,
} from '../schemas/interview-session.schema';
import {
  InterviewTurn,
  InterviewTurnDocument,
  TurnType,
} from '../schemas/interview-turn.schema';
import {
  InterviewScore,
  InterviewScoreDocument,
} from '../schemas/interview-score.schema';
import { SessionContextBuilderService } from './services/session-context-builder.service';
import { CoachingService } from './services/coaching.service';
import { ScoringService } from './services/scoring.service';
import { STTProvider } from './interfaces/stt-provider.interface';
type SessionContextPack = any; // Temporary until contracts package is fixed
import { v4 as uuidv4 } from 'uuid';
import { EntitlementService } from '../entitlement/entitlement.service';

@Injectable()
export class InterviewBuddyService {
  private readonly logger = new Logger(InterviewBuddyService.name);

  constructor(
    @InjectModel(InterviewSession.name)
    private sessionModel: Model<InterviewSessionDocument>,
    @InjectModel(InterviewTurn.name)
    private turnModel: Model<InterviewTurnDocument>,
    @InjectModel(InterviewScore.name)
    private scoreModel: Model<InterviewScoreDocument>,
    private readonly contextBuilder: SessionContextBuilderService,
    private readonly coachingService: CoachingService,
    private readonly scoringService: ScoringService,
    @Inject('STTProvider') private readonly sttProvider: STTProvider,
    private readonly entitlementService: EntitlementService,
  ) {}

  async createSession(
    userId: string,
    data: {
      mode: InterviewMode;
      resumeVersionId?: string;
      jobDescriptionIds?: string[];
      roleTitle: string;
      companyName?: string;
      roleFamily?: 'SWE_BACKEND' | 'DEVOPS_CLOUD' | 'PM' | 'DATA';
      seniority?: 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'STAFF' | 'PRINCIPAL' | 'MANAGER';
      interviewType?: 'BEHAVIORAL' | 'TECHNICAL' | 'SYSTEM_DESIGN' | 'CODING' | 'CASE' | 'MIXED';
      skipRequirements?: boolean;
    },
  ): Promise<InterviewSessionDocument> {
    // Check quota for interview sessions
    const quotaCheck = await this.entitlementService.checkEntitlement(userId, {
      featureKey: 'interview_sessions_per_month',
      incrementUsage: false,
    });

    if (!quotaCheck.allowed) {
      throw new ForbiddenException(
        quotaCheck.message || 'Interview session quota exceeded. Please upgrade your plan.',
      );
    }

    // Validate requirements unless explicitly skipped
    if (!data.skipRequirements) {
      if (!data.resumeVersionId && !data.jobDescriptionIds?.length) {
        throw new BadRequestException(
          'Resume version ID or job description ID is required',
        );
      }
    }

    const sessionId = uuidv4();

    // Build context pack
    const contextPack = await this.contextBuilder.buildContextPack(
      userId,
      sessionId,
      data.mode,
      data.roleTitle,
      data.resumeVersionId || undefined,
      data.jobDescriptionIds || undefined,
      data.companyName || undefined,
      data.roleFamily || 'SWE_BACKEND',
      data.seniority || 'MID',
      data.interviewType || 'MIXED',
    );

    // Create session
    const session = new this.sessionModel({
      userId,
      mode: data.mode,
      resumeVersionId: data.resumeVersionId,
      jobDescriptionIds: data.jobDescriptionIds || [],
      roleTitle: data.roleTitle,
      companyName: data.companyName,
      status: InterviewStatus.CREATED,
      contextPack,
    });

    const savedSession = await session.save();

    // Increment usage after successful creation
    await this.entitlementService.checkEntitlement(userId, {
      featureKey: 'interview_sessions_per_month',
      incrementUsage: true,
    });

    return savedSession;
  }

  async startSession(sessionId: string, userId: string): Promise<InterviewSessionDocument> {
    const session = await this.sessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== InterviewStatus.CREATED) {
      throw new BadRequestException('Session cannot be started');
    }

    session.status = InterviewStatus.IN_PROGRESS;
    session.startedAt = new Date();
    return session.save();
  }

  async addTurn(
    sessionId: string,
    userId: string,
    type: TurnType,
    text: string,
    segments?: any[],
    sttConfidence?: number,
  ): Promise<InterviewTurnDocument> {
    const session = await this.sessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const turn = new this.turnModel({
      sessionId: session._id,
      type,
      text,
      segments,
      sttConfidence,
      startTs: Date.now(),
    });

    return turn.save();
  }

  async addLiveNote(
    sessionId: string,
    userId: string,
    questionText: string,
  ): Promise<{ turn: InterviewTurnDocument; coaching: any }> {
    // Add question turn
    const questionTurn = await this.addTurn(
      sessionId,
      userId,
      TurnType.QUESTION,
      questionText,
    );

    // Get context pack
    const session = await this.sessionModel.findById(sessionId);
    if (!session || session.userId.toString() !== userId) {
      throw new NotFoundException('Session not found');
    }

    const contextPack = session.contextPack as SessionContextPack;

    // Generate coaching
    const coaching = await this.coachingService.generateCoaching(
      contextPack,
      questionText,
    );

    // Add coaching turn
    const coachingTurn = await this.addTurn(
      sessionId,
      userId,
      TurnType.COACHING,
      JSON.stringify(coaching),
    );

    return {
      turn: questionTurn,
      coaching,
    };
  }

  async scoreTurn(
    sessionId: string,
    userId: string,
    turnId: string,
  ): Promise<InterviewScoreDocument> {
    const session = await this.sessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const turn = await this.turnModel.findOne({
      _id: turnId,
      sessionId: session._id,
      type: TurnType.ANSWER,
    });

    if (!turn) {
      throw new NotFoundException('Answer turn not found');
    }

    // Find the question turn that preceded this answer
    const turnDoc = turn as any; // Type assertion for Mongoose document
    const questionTurn = await this.turnModel
      .findOne({
        sessionId: session._id,
        type: TurnType.QUESTION,
        createdAt: { $lt: turnDoc.createdAt || new Date() },
      })
      .sort({ createdAt: -1 });

    const contextPack = session.contextPack as SessionContextPack;

    // Score the answer
    const scoring = await this.scoringService.scoreAnswer(
      contextPack,
      questionTurn?.text || 'Unknown question',
      turn.text,
    );

    // Save score
    const score = new this.scoreModel({
      sessionId: session._id,
      turnId: turn._id,
      rubricJson: contextPack.rubric,
      scoresJson: scoring,
      overallScore: scoring.overallScore,
    });

    return score.save();
  }

  async getSession(sessionId: string, userId: string): Promise<any> {
    const session = await this.sessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Get all turns
    const turns = await this.turnModel
      .find({ sessionId: session._id })
      .sort({ createdAt: 1 });

    // Get all scores
    const scores = await this.scoreModel.find({ sessionId: session._id });

    return {
      session,
      turns,
      scores,
    };
  }

  async endSession(sessionId: string, userId: string): Promise<InterviewSessionDocument> {
    const session = await this.sessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.status = InterviewStatus.COMPLETED;
    session.endedAt = new Date();
    return session.save();
  }

  async deleteSession(sessionId: string, userId: string): Promise<void> {
    const session = await this.sessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Delete related turns and scores
    await this.turnModel.deleteMany({ sessionId: session._id });
    await this.scoreModel.deleteMany({ sessionId: session._id });

    // Delete session
    await session.deleteOne();
  }

  async transcribeAudio(audioData: Buffer): Promise<any> {
    return this.sttProvider.transcribe(audioData);
  }
}


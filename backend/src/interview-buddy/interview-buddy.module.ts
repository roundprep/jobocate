import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterviewBuddyController } from './interview-buddy.controller';
import { InterviewBuddyService } from './interview-buddy.service';
import {
  InterviewSession,
  InterviewSessionSchema,
} from '../schemas/interview-session.schema';
import {
  InterviewTurn,
  InterviewTurnSchema,
} from '../schemas/interview-turn.schema';
import {
  InterviewScore,
  InterviewScoreSchema,
} from '../schemas/interview-score.schema';
import { PromptVersion, PromptVersionSchema } from '../schemas/prompt-version.schema';
import { Resume, ResumeSchema } from '../schemas/resume.schema';
import { Job, JobSchema } from '../schemas/job.schema';
import { SessionContextBuilderService } from './services/session-context-builder.service';
import { CoachingService } from './services/coaching.service';
import { ScoringService } from './services/scoring.service';
import { MockSTTProvider } from './providers/mock-stt.provider';
import { OpenAIWhisperBatchProvider } from './providers/openai-whisper.provider';
import { LLMModule } from '../llm/llm.module';
import { EntitlementModule } from '../entitlement/entitlement.module';
import { InterviewAudioGateway } from './gateways/interview-audio.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InterviewSession.name, schema: InterviewSessionSchema },
      { name: InterviewTurn.name, schema: InterviewTurnSchema },
      { name: InterviewScore.name, schema: InterviewScoreSchema },
      { name: PromptVersion.name, schema: PromptVersionSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: Job.name, schema: JobSchema },
    ]),
    LLMModule,
    EntitlementModule,
    JwtModule,
  ],
  controllers: [InterviewBuddyController],
  providers: [
    InterviewAudioGateway,
    InterviewBuddyService,
    SessionContextBuilderService,
    CoachingService,
    ScoringService,
    {
      provide: 'STTProvider',
      useClass: process.env.STT_PROVIDER === 'openai' 
        ? OpenAIWhisperBatchProvider 
        : MockSTTProvider,
    },
  ],
  exports: [InterviewBuddyService],
})
export class InterviewBuddyModule {}


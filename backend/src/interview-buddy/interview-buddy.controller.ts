import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InterviewBuddyService } from './interview-buddy.service';
import { InterviewMode, InterviewStatus } from '../schemas/interview-session.schema';

@ApiTags('interview-buddy')
@Controller('interview-sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class InterviewBuddyController {
  constructor(private readonly interviewBuddyService: InterviewBuddyService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new interview session' })
  async createSession(@Body() body: any, @Request() req) {
    return this.interviewBuddyService.createSession(req.user._id.toString(), {
      mode: body.mode,
      resumeVersionId: body.resumeVersionId,
      jobDescriptionIds: body.jobDescriptionIds,
      roleTitle: body.roleTitle,
      companyName: body.companyName,
      roleFamily: body.roleFamily,
      seniority: body.seniority,
      interviewType: body.interviewType,
      skipRequirements: body.skipRequirements,
    });
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start an interview session' })
  async startSession(@Param('id') id: string, @Request() req) {
    return this.interviewBuddyService.startSession(id, req.user._id.toString());
  }

  @Post(':id/live-notes')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Add a live note (question) in Live Notes mode' })
  async addLiveNote(
    @Param('id') id: string,
    @Body() body: { questionText: string },
    @Request() req,
  ) {
    return this.interviewBuddyService.addLiveNote(
      id,
      req.user._id.toString(),
      body.questionText,
    );
  }

  @Post(':id/turns/:turnId/score')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Score an answer turn' })
  async scoreTurn(
    @Param('id') id: string,
    @Param('turnId') turnId: string,
    @Request() req,
  ) {
    return this.interviewBuddyService.scoreTurn(
      id,
      req.user._id.toString(),
      turnId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full session timeline' })
  async getSession(@Param('id') id: string, @Request() req) {
    return this.interviewBuddyService.getSession(id, req.user._id.toString());
  }

  @Post(':id/end')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End an interview session' })
  async endSession(@Param('id') id: string, @Request() req) {
    return this.interviewBuddyService.endSession(id, req.user._id.toString());
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Hard delete user-owned session data' })
  async deleteSession(@Param('id') id: string, @Request() req) {
    await this.interviewBuddyService.deleteSession(id, req.user._id.toString());
  }
}


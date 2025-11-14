import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationAgentService } from './application-agent.service';
import { AgentAssignmentService } from './agent-assignment.service';
import { Application, ApplicationSchema } from '../schemas/application.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { Job, JobSchema } from '../schemas/job.schema';
import { JobMatch, JobMatchSchema } from '../schemas/job-match.schema';
import { MatchingModule } from '../matching/matching.module';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: User.name, schema: UserSchema },
      { name: Job.name, schema: JobSchema },
      { name: JobMatch.name, schema: JobMatchSchema },
    ]),
    forwardRef(() => MatchingModule),
    LoggerModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationAgentService, AgentAssignmentService],
  exports: [ApplicationsService, ApplicationAgentService, AgentAssignmentService],
})
export class ApplicationsModule {}


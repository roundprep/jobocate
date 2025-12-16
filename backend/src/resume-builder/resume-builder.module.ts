import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResumeBuilderController } from './resume-builder.controller';
import { ResumeBuilderService } from './resume-builder.service';
import { Resume, ResumeSchema } from '../schemas/resume.schema';
import { ResumeVersion, ResumeVersionSchema } from '../schemas/resume-version.schema';
import { ShareLink, ShareLinkSchema } from '../schemas/share-link.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { AiServicesModule } from '../ai-services/ai-services.module';
import { ResumeModule } from '../resume/resume.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resume.name, schema: ResumeSchema },
      { name: User.name, schema: UserSchema },
      { name: ResumeVersion.name, schema: ResumeVersionSchema },
      { name: ShareLink.name, schema: ShareLinkSchema },
    ]),
    AiServicesModule,
    forwardRef(() => ResumeModule),
  ],
  controllers: [ResumeBuilderController],
  providers: [ResumeBuilderService],
  exports: [ResumeBuilderService],
})
export class ResumeBuilderModule { }


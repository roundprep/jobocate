import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name?: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password?: string;

  @Prop()
  googleId?: string;

  @Prop()
  linkedinId?: string;

  @Prop()
  picture?: string;

  @Prop({ enum: ['local', 'google', 'linkedin'], default: 'local' })
  provider?: string;

  @Prop({ enum: ['ROLE_CANDIDATE', 'ROLE_EMPLOYER', 'ROLE_AGENT', 'ROLE_ADMIN'], default: 'ROLE_CANDIDATE' })
  role?: string;

  // User basic info
  @Prop()
  phone?: string;

  @Prop()
  location?: string;

  @Prop()
  summary?: string;

  @Prop([{ type: String }])
  skills?: string[];

  @Prop([{
    title: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    achievements: [String],
  }])
  experience?: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    achievements?: string[];
  }>;

  @Prop([{
    degree: String,
    institution: String,
    location: String,
    startDate: String,
    endDate: String,
    gpa: String,
    description: String,
  }])
  education?: Array<{
    degree: string;
    institution: string;
    location?: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
    description?: string;
  }>;

  @Prop()
  lastLogin?: Date;

  // Package/Subscription info for candidates
  @Prop({ enum: ['free', 'basic', 'premium', 'enterprise'], default: 'free' })
  package?: string;

  @Prop()
  packageExpiresAt?: Date;

  // Agent-specific fields
  @Prop({ default: 0 })
  assignedCandidatesCount?: number;

  @Prop({ default: true })
  isActive?: boolean;

  // Password reset fields
  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  // Email verification fields
  @Prop({ default: false })
  emailVerified?: boolean;

  @Prop()
  emailVerificationToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


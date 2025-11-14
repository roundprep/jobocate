import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resume, ResumeDocument } from '../schemas/resume.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { AiProviderService } from '../ai-services/ai-provider.service';
import { ResumeParserService } from '../resume/resume-parser.service';
import { ResumeService } from '../resume/resume.service';
import { CreateResumeDto, RegenerateSectionDto } from './dto/create-resume.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable()
export class ResumeBuilderService {
  private readonly logger = new Logger(ResumeBuilderService.name);
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');

  constructor(
    @InjectModel(Resume.name)
    private resumeModel: Model<ResumeDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private aiProviderService: AiProviderService,
    private resumeParserService: ResumeParserService,
  ) {
    this.ensureUploadsDirectory();
  }

  private async ensureUploadsDirectory() {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create uploads directory:', error);
    }
  }

  async findAll(userId: string): Promise<ResumeDocument[]> {
    return this.resumeModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<ResumeDocument> {
    const resume = await this.resumeModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    }).exec();

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    return resume;
  }

  async create(userId: string, createDto: CreateResumeDto): Promise<ResumeDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let resumeData: any = {
      userId: new Types.ObjectId(userId),
      template: createDto.template,
      name: createDto.name || 'Untitled Resume',
    };

    // Import from user profile if requested
    if (createDto.importFromProfile) {
      resumeData = {
        ...resumeData,
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        summary: user.summary,
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
      };
    }

    const resume = new this.resumeModel(resumeData);
    return resume.save();
  }

  async createFromUpload(
    userId: string,
    file: Express.Multer.File,
    template: string,
  ): Promise<ResumeDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Parse uploaded resume
    const parseResult = await this.resumeParserService.parseResume(file);

    // Create resume from parsed data
    const resume = new this.resumeModel({
      userId: new Types.ObjectId(userId),
      template,
      name: `Resume - ${parseResult.parsedData.name || 'Imported'}`,
      fullName: parseResult.parsedData.name,
      email: parseResult.parsedData.email,
      phone: parseResult.parsedData.phone,
      summary: parseResult.parsedData.summary,
      skills: parseResult.parsedData.skills || [],
      experience: parseResult.parsedData.experience || [],
      education: parseResult.parsedData.education || [],
    });

    return resume.save();
  }

  async update(id: string, userId: string, updates: Partial<Resume>): Promise<ResumeDocument> {
    const resume = await this.findOne(id, userId);
    
    Object.assign(resume, updates);
    return resume.save();
  }

  async regenerateSection(
    id: string,
    userId: string,
    regenerateDto: RegenerateSectionDto,
  ): Promise<string> {
    const resume = await this.findOne(id, userId);
    const user = await this.userModel.findById(userId).exec();

    const sectionPrompts = {
      summary: `Generate a professional summary for this candidate. Make it compelling and highlight key strengths.

Candidate Information:
- Name: ${resume.fullName || user?.name || 'Candidate'}
- Skills: ${(resume.skills || []).join(', ')}
- Experience: ${JSON.stringify(resume.experience || [])}
${regenerateDto.jobDescription ? `- Target Job: ${regenerateDto.jobDescription}` : ''}
${regenerateDto.context ? `- Additional Context: ${regenerateDto.context}` : ''}

Write a professional summary (2-3 sentences) that highlights the candidate's expertise, experience, and value proposition.`,

      profileSummary: `Generate a comprehensive profile summary for this candidate. This should be more detailed than a brief summary, providing a complete overview of the candidate's professional background, achievements, and career highlights.

Candidate Information:
- Name: ${resume.fullName || user?.name || 'Candidate'}
- Skills: ${(resume.skills || []).join(', ')}
- Experience: ${JSON.stringify(resume.experience || [])}
- Education: ${JSON.stringify(resume.education || [])}
${regenerateDto.jobDescription ? `- Target Job: ${regenerateDto.jobDescription}` : ''}
${regenerateDto.context ? `- Additional Context: ${regenerateDto.context}` : ''}

Write a comprehensive profile summary (4-6 sentences or 2-3 paragraphs) that:
- Provides a complete professional overview
- Highlights key achievements and career progression
- Showcases expertise and value proposition
- Demonstrates impact and results
- Uses rich, engaging language suitable for a resume profile section`,

      experience: `Rewrite and enhance this work experience entry to be more impactful and ATS-friendly. Use action verbs and quantify achievements where possible.

Current Experience:
${JSON.stringify(resume.experience || [])}
${regenerateDto.jobDescription ? `Target Job: ${regenerateDto.jobDescription}` : ''}

Rewrite each experience entry with:
- Strong action verbs
- Quantified achievements
- Relevant keywords
- Clear impact statements`,

      skills: `Analyze the candidate's experience and generate a comprehensive list of relevant skills, organized by category.

Experience: ${JSON.stringify(resume.experience || [])}
Education: ${JSON.stringify(resume.education || [])}
${regenerateDto.jobDescription ? `Target Job Requirements: ${regenerateDto.jobDescription}` : ''}

Generate a list of relevant skills, including:
- Technical skills
- Soft skills
- Tools and technologies
- Industry-specific skills`,

      education: `Enhance the education section to be more detailed and professional.

Current Education: ${JSON.stringify(resume.education || [])}

Provide enhanced education entries with:
- Full degree names
- Institution details
- Relevant coursework or achievements
- Academic honors if applicable`,
    };

    const prompt = sectionPrompts[regenerateDto.section] || `Generate content for the ${regenerateDto.section} section based on the candidate's profile.`;

    try {
      const openai = (this.aiProviderService as any).openai;
      const anthropic = (this.aiProviderService as any).anthropic;
      const provider = (this.aiProviderService as any).provider || 'openai';

      let response: any;

      if (provider === 'openai' && openai) {
        response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a professional resume writer. Generate optimized, ATS-friendly content for resume sections. Return only the content, no explanations.`,
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        if (response?.choices?.[0]?.message?.content) {
          return response.choices[0].message.content.trim();
        }
      } else if (provider === 'anthropic' && anthropic) {
        response = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a professional resume writer. Generate optimized, ATS-friendly content for resume sections. Return only the content, no explanations.\n\n${prompt}`,
            },
          ],
        });

        if (response?.content?.[0]?.text) {
          return response.content[0].text.trim();
        }
      }

      throw new Error('AI generation failed');
    } catch (error) {
      this.logger.error(`Error regenerating ${regenerateDto.section}:`, error);
      throw new Error(`Failed to regenerate ${regenerateDto.section}`);
    }
  }

  async generatePDF(resume: ResumeDocument): Promise<string> {
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const margin = 72;
      const pageWidth = 612;
      const pageHeight = 792;
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let yPosition = pageHeight - margin;

      // Header with name
      if (resume.fullName) {
        currentPage.drawText(resume.fullName, {
          x: margin,
          y: yPosition,
          size: 18,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 25;
      }

      // Contact info
      const contactInfo = [
        resume.email,
        resume.phone,
        resume.location,
        resume.website,
        resume.linkedin,
      ].filter(Boolean).join(' | ');

      if (contactInfo) {
        currentPage.drawText(contactInfo, {
          x: margin,
          y: yPosition,
          size: 10,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        });
        yPosition -= 30;
      }

      // Summary
      if (resume.summary) {
        currentPage.drawText('PROFESSIONAL SUMMARY', {
          x: margin,
          y: yPosition,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;

        const summaryLines = this.splitTextIntoLines(resume.summary, 70);
        for (const line of summaryLines) {
          if (yPosition < margin + 50) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            yPosition = pageHeight - margin;
          }
          currentPage.drawText(line, {
            x: margin,
            y: yPosition,
            size: 10,
            font: font,
            color: rgb(0, 0, 0),
          });
          yPosition -= 14;
        }
        yPosition -= 10;
      }

      // Skills
      if (resume.skills && resume.skills.length > 0) {
        if (yPosition < margin + 50) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }

        currentPage.drawText('SKILLS', {
          x: margin,
          y: yPosition,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;

        const skillsText = resume.skills.join(' • ');
        const skillsLines = this.splitTextIntoLines(skillsText, 70);
        for (const line of skillsLines) {
          if (yPosition < margin + 50) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            yPosition = pageHeight - margin;
          }
          currentPage.drawText(line, {
            x: margin,
            y: yPosition,
            size: 10,
            font: font,
            color: rgb(0, 0, 0),
          });
          yPosition -= 14;
        }
        yPosition -= 10;
      }

      // Experience
      if (resume.experience && resume.experience.length > 0) {
        if (yPosition < margin + 100) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }

        currentPage.drawText('PROFESSIONAL EXPERIENCE', {
          x: margin,
          y: yPosition,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 25;

        for (const exp of resume.experience) {
          if (yPosition < margin + 80) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            yPosition = pageHeight - margin;
          }

          // Job title and company
          const titleCompany = `${exp.title} | ${exp.company}`;
          currentPage.drawText(titleCompany, {
            x: margin,
            y: yPosition,
            size: 11,
            font: boldFont,
            color: rgb(0, 0, 0),
          });
          yPosition -= 16;

          // Dates and location
          const dateLocation = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || ''}${exp.location ? ` | ${exp.location}` : ''}`;
          currentPage.drawText(dateLocation, {
            x: margin,
            y: yPosition,
            size: 9,
            font: font,
            color: rgb(0.4, 0.4, 0.4),
          });
          yPosition -= 16;

          // Description
          if (exp.description) {
            const descLines = this.splitTextIntoLines(exp.description, 70);
            for (const line of descLines) {
              if (yPosition < margin + 50) {
                currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                yPosition = pageHeight - margin;
              }
              currentPage.drawText(`• ${line}`, {
                x: margin + 10,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
              });
              yPosition -= 14;
            }
          }

          // Achievements
          if (exp.achievements && exp.achievements.length > 0) {
            for (const achievement of exp.achievements) {
              if (yPosition < margin + 50) {
                currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                yPosition = pageHeight - margin;
              }
              currentPage.drawText(`• ${achievement}`, {
                x: margin + 10,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
              });
              yPosition -= 14;
            }
          }

          yPosition -= 10;
        }
      }

      // Education
      if (resume.education && resume.education.length > 0) {
        if (yPosition < margin + 100) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = pageHeight - margin;
        }

        currentPage.drawText('EDUCATION', {
          x: margin,
          y: yPosition,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 25;

        for (const edu of resume.education) {
          if (yPosition < margin + 50) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            yPosition = pageHeight - margin;
          }

          const eduText = `${edu.degree} | ${edu.institution}${edu.endDate ? ` | ${edu.endDate}` : ''}`;
          currentPage.drawText(eduText, {
            x: margin,
            y: yPosition,
            size: 10,
            font: font,
            color: rgb(0, 0, 0),
          });
          yPosition -= 20;
        }
      }

      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const filename = `resume-${resume._id}-${Date.now()}.pdf`;
      const filepath = path.join(this.uploadsDir, filename);

      await fs.writeFile(filepath, pdfBytes);

      return filepath;
    } catch (error) {
      this.logger.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  private splitTextIntoLines(text: string, maxLength: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  async delete(id: string, userId: string): Promise<void> {
    const resume = await this.findOne(id, userId);

    if (resume.pdfPath) {
      try {
        await fs.unlink(resume.pdfPath);
      } catch (error) {
        this.logger.warn(`Failed to delete PDF file: ${resume.pdfPath}`, error);
      }
    }

    await this.resumeModel.deleteOne({ _id: id }).exec();
  }

  async getPDFPath(id: string, userId: string): Promise<string> {
    const resume = await this.findOne(id, userId);

    if (!resume.pdfPath) {
      const pdfPath = await this.generatePDF(resume);
      resume.pdfPath = pdfPath;
      resume.pdfUrl = `/api/resume-builder/${resume._id}/pdf`;
      await resume.save();
    }

    return resume.pdfPath;
  }
}


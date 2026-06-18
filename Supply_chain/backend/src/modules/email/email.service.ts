import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('GOOGLE_MAIL_USER');
    const pass = this.configService.get<string>('GOOGLE_MAIL_APP_PASSWORD');

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });
    } else {
      this.logger.warn('GOOGLE_MAIL_USER or GOOGLE_MAIL_APP_PASSWORD not set. Email service will be disabled.');
    }
  }

  async sendUserInvite(email: string, name: string, plainTextPassword?: string) {
    if (!this.transporter) {
      this.logger.warn(`Skipping invite email to ${email} because EmailService is not configured.`);
      return;
    }

    const mailOptions = {
      from: `"Nexus Logistics" <${this.configService.get<string>('GOOGLE_MAIL_USER')}>`,
      to: email,
      subject: 'Welcome to Nexus Logistics Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333;">Welcome to Nexus Logistics, ${name}!</h2>
          <p style="color: #555; line-height: 1.6;">
            An administrator has created an account for you on the Nexus Logistics platform.
          </p>
          ${plainTextPassword ? `
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>Your Login Credentials:</strong></p>
            <p style="margin: 8px 0; color: #555;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0; color: #555;"><strong>Password:</strong> <span style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${plainTextPassword}</span></p>
          </div>
          <p style="color: #d97706; font-size: 0.9em;">
            <em>Please log in and change your password immediately.</em>
          </p>
          ` : `
          <p style="color: #555; line-height: 1.6;">
            You can log in using Single Sign-On (SSO) with this email address.
          </p>
          `}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #888;">
            <p>Nexus Control &bull; Enterprise Logistics Management</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Invite email successfully sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send invite email to ${email}`, error.stack);
    }
  }
}

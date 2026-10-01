import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import { EMAIL_SEND_EVENT, SEND_EMAIL_VERIFY } from './email.constants';
import { sendEmailVerifyTemplate } from './template/sendEmailVerify';

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  data?: any;
}

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    const user = this.configService.get<string>('MAIL_USER');
    const password = this.configService.get<string>('MAIL_PASSWORD');

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT') ?? 587),
      secure: this.configService.get<string>('MAIL_SECURE') === 'true',
      auth: user && password ? { user, pass: password } : undefined,
    });
  }

  async emitEmail(payload: SendEmailPayload): Promise<unknown[]> {
    return this.eventEmitter.emitAsync(EMAIL_SEND_EVENT, payload);
  }

  @OnEvent(EMAIL_SEND_EVENT, { async: true })
  handleEmailSend(payload: SendEmailPayload): void {
    this.sendEmail(payload);
  }

  @OnEvent(SEND_EMAIL_VERIFY, { async: true })
  handleEmailVerify(payload: SendEmailPayload): void {
    const data = btoa(
      JSON.stringify({
        email: payload.data,
        expiredIn: new Date(Date.now() + 300000).toISOString(),
      }),
    );
    const template = sendEmailVerifyTemplate(data);
    this.sendEmail({ ...payload, html: template });
  }

  async sendEmail(payload: SendEmailPayload): Promise<void> {
    const from =
      payload.from ??
      this.configService.get<string>('MAIL_FROM') ??
      this.configService.get<string>('MAIL_USER');
    console.log(
      'Sending email with payload:',
      this.configService.get<string>('MAIL_PASSWORD'),
      from,
    );

    if (!from) {
      throw new Error('MAIL_FROM or MAIL_USER must be configured.');
    }
    try {
      await this.transporter.sendMail({
        from,
        to: 'aryobimoww19@gmail.com',
        subject: payload.subject ?? 'greeting',
        text: payload.text ?? 'HELLO WORLD',
        html:
          payload.html ??
          `<p style="color: blue;">HELLO WORLD I am ${from}</p>`,
      });
      console.log('Email sent:');
    } catch (error) {
      console.error('Error sending email:', error);
    }
    // await this.transporter.sendMail({
    //   from,
    //   to: 'aryobimoww19@gmail.com',
    //   subject: 'greeting',
    //   text: payload.text ?? 'HELLO WORLD',
    //   html: payload.html ?? '<p style="color: blue;">HELLO WORLD</p>',
    // });
    // console.log('Email sent:');
  }
}

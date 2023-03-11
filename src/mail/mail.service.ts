import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sendgridMail from '@sendgrid/mail';
import { MailInput } from './mail.interface';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    sendgridMail.setApiKey(configService.get('SENDGRID_API_KEY'));
  }
  async sendMail(input: MailInput) {
    await sendgridMail.send({
      from: this.configService.get('SENDGRID_FORM'),
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  }
}

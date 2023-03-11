import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [],
  providers: [MailService, ConfigService],
  exports: [MailService],
})
export class MailModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: '1200s' },
    }),
    PassportModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, ConfigService],
})
export class AuthModule {}

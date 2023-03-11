import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { MailService } from '@sendgrid/mail';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, MailService],
})
export class UsersModule {}

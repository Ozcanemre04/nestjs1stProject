import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { comparePasswords, hashPassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { randomUUID } from 'crypto';
import { PasswordResetDto } from './dto/passwordReset.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}
  private createToken(payload: string | object | Buffer) {
    return this.jwt.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }
  async signup(dto: RegisterDto) {
    const { email, password, firstname, lastname, phone_number } = dto;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await hashPassword(password);
    await this.prisma.user.create({
      data: {
        email,
        firstname,
        lastname,
        phone_number,
        hashedPassword,
      },
    });
    const token = this.createToken({ email });
    const url = `http://localhost:3000/auth/confirm/${token}`;
    const html = `<p>Click <a href=${url}>here</a> to confirm your email address </p>`;
    await this.mailService.sendMail({
      html,
      to: email,
      subject: 'please confirm your email',
    });
    const msg = 'mail send';
    return { msg };
  }
  async confirmEmail(token: string) {
    const result = this.jwt.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    if (
      !result ||
      typeof result !== 'object' ||
      !result.email ||
      typeof result.email !== 'string'
    ) {
      throw new UnauthorizedException('Invalid Token');
    }
    const user = await this.prisma.user.findUnique({
      where: { email: result.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid Token');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { verified: true },
    });
    return {
      message: 'Email is confirmed',
    };
  }
  async signin(dto: AuthDto, req: Request, res: Response) {
    const { email, password } = dto;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (!foundUser) {
      throw new BadRequestException('Wrong Credentials');
    }
    if (foundUser.verified === false) {
      throw new UnauthorizedException('account is not verificated');
    }
    const isMatch = await comparePasswords({
      password,
      hash: foundUser.hashedPassword,
    });
    if (!isMatch) {
      throw new BadRequestException('Wrong Credentials');
    }
    //sign jwt and return to the user
    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
    });
    if (!token) {
      throw new ForbiddenException();
    }
    res.cookie('token', token);
    return res.send({ message: 'Logged succesfully', token });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'logged out succesfully' });
  }

  async signToken(args: { id: string; email: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
  async forgetPassword(dto: ForgetPasswordDto) {
    const token = randomUUID();
    const { email } = dto;
    const verifyEmail = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!verifyEmail) {
      throw new NotFoundException("email doesn't exist");
    } else {
      await this.prisma.forgetPasswordToken.create({
        data: {
          token,
          email,
          userid: verifyEmail.id,
        },
      });
      const html = `<p>your token: ${token} for reset your password</p>`;
      await this.mailService.sendMail({
        html,
        to: email,
        subject: 'token',
      });
      const msg = 'send';
      return { msg };
    }
  }
  async resetPassword(dto: PasswordResetDto) {
    const { password, token } = dto;
    const verifyToken = await this.prisma.forgetPasswordToken.findUnique({
      where: {
        token,
      },
    });
    if (!verifyToken) {
      throw new NotFoundException();
    }
    const hashedPassword = await hashPassword(password);
    const reset = await this.prisma.resetPassword.create({
      data: {
        token,
        newpassword: hashedPassword,
        userid: verifyToken.userid,
      },
    });
    const updatedUser = await this.prisma.user.update({
      where: { id: reset.userid },
      data: { hashedPassword: reset.newpassword },
    });
    await this.prisma.forgetPasswordToken.delete({
      where: {
        token,
      },
    });
    await this.prisma.resetPassword.delete({
      where: {
        userid: updatedUser.id,
      },
    });
    return { updatedUser };
  }
}

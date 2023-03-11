import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { randomUUID } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { PasswordChangeDto } from './dto/changePassword.dto';
import { hashPassword } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getMyUser(req: Request) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const foundUser = await this.prisma.user.findUnique({
      where: { id: decodedUserInfo.id },
      include: { adress: true },
    });

    delete foundUser.hashedPassword;
    return { user: foundUser };
  }
  async updateUser(req: Request, dto: UpdateUserDto) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const { firstname, lastname, phone_number } = dto;
    const update = await this.prisma.user.update({
      where: { id: decodedUserInfo.id },
      data: {
        firstname,
        lastname,
        phone_number,
      },
    });
    return update;
  }

  async sendToken(req: Request) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const token = randomUUID();
    await this.prisma.changePasswordToken.create({
      data: {
        token,
        userid: decodedUserInfo.id,
      },
    });

    const html = `<p>your token: ${token} to change your password</p>`;
    await this.mailService.sendMail({
      html,
      to: decodedUserInfo.email,
      subject: 'token for your password',
    });
    const msg = 'token sended to your email adress';
    return { msg };
  }
  async changePassword(req: Request, dto: PasswordChangeDto) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const { password, token } = dto;
    const verifyToken = await this.prisma.changePasswordToken.findUnique({
      where: {
        token,
      },
    });
    if (!verifyToken) {
      throw new NotFoundException("token doesn't exist");
    }
    const hashedPassword = await hashPassword(password);
    const change = await this.prisma.changePassword.create({
      data: {
        token,
        newpassword: hashedPassword,
        userid: decodedUserInfo.id,
      },
    });
    const updatedUser = await this.prisma.user.update({
      where: { id: decodedUserInfo.id },
      data: { hashedPassword: change.newpassword },
    });
    await this.prisma.changePasswordToken.delete({
      where: {
        userid: decodedUserInfo.id,
      },
    });
    await this.prisma.changePassword.delete({
      where: {
        userid: decodedUserInfo.id,
      },
    });
    delete updatedUser.hashedPassword;
    return updatedUser;
  }
}

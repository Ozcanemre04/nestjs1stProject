import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }
  @Get('confirm/:token')
  confirmEmail(@Param('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto, @Req() req, @Res() res) {
    return this.authService.signin(dto, req, res);
  }

  @Get('logout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }
  @Post('forget_password')
  forgetPassword(@Body() dto: ForgetPasswordDto) {
    return this.authService.forgetPassword(dto);
  }
  @Post('reset_password')
  resetPassword(@Body() dto: PasswordResetDto) {
    return this.authService.resetPassword(dto);
  }
}

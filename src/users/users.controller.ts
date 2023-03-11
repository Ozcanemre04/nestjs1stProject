import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UpdateUserDto } from './dto/update.user.dto';
import { PasswordChangeDto } from './dto/changePassword.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getMyUser(@Req() req) {
    return this.usersService.getMyUser(req);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  updateUser(@Body() dto: UpdateUserDto, @Req() req) {
    return this.usersService.updateUser(req, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/sendToken')
  sendToken(@Req() req) {
    return this.usersService.sendToken(req);
  }
  @UseGuards(JwtAuthGuard)
  @Post('/changePassword')
  changePassword(@Req() req, @Body() dto: PasswordChangeDto) {
    return this.usersService.changePassword(req, dto);
  }
}

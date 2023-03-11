import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdressService } from './adress.service';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('adress')
export class AdressController {
  constructor(private readonly adressService: AdressService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createAdressDto: CreateAdressDto, @Req() req) {
    return this.adressService.create(createAdressDto, req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('get')
  GetAdress(@Req() req) {
    return this.adressService.getAdress(req);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  update(@Body() updateAdressDto: UpdateAdressDto, @Req() req) {
    return this.adressService.update(updateAdressDto, req);
  }
}

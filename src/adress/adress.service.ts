import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdressDto } from './dto/create-adress.dto';
import { UpdateAdressDto } from './dto/update-adress.dto';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AdressService {
  constructor(private prisma: PrismaService) {}
  async create(createAdressDto: CreateAdressDto, req: Request) {
    const { zip, country, city, street } = createAdressDto;
    const decodedUserInfo = req.user as { id: string; email: string };
    const adress = await this.prisma.adress.findUnique({
      where: { userid: decodedUserInfo.id },
    });
    if (adress) {
      throw new UnauthorizedException('adress already added');
    }
    const newAdress = await this.prisma.adress.create({
      data: {
        zip,
        country,
        city,
        street,
        userid: decodedUserInfo.id,
      },
    });
    return newAdress;
  }

  async getAdress(req: Request) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const adress = await this.prisma.adress.findUnique({
      where: { userid: decodedUserInfo.id },
    });
    if (!adress) {
      throw new NotFoundException('adress not found');
    }
    return adress;
  }

  async update(updateAdressDto: UpdateAdressDto, req: Request) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const { zip, country, city, street } = updateAdressDto;
    await this.getAdress(req);
    const update = await this.prisma.adress.update({
      where: { userid: decodedUserInfo.id },
      data: {
        zip,
        country,
        city,
        street,
      },
    });
    return update;
  }
}

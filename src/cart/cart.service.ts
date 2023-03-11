import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductsService,
  ) {}

  async getitemsInCart(req: Request) {
    const decodedUserInfo = req.user as { id: string; email: string };

    const items = await this.prisma.cart.findMany({
      where: { userid: decodedUserInfo.id },
      include: { product: true },
    });
    if (!items) {
      throw new ForbiddenException();
    }
    return items;
  }

  async addToCart(id: number, req: Request) {
    const decodedUserInfo = req.user as { id: string; email: string };

    const item = await this.prisma.cart.findFirst({
      where: { userid: decodedUserInfo.id, productid: id },
      include: { product: true },
    });
    const product = await this.productService.getOneProduct(id);

    if (item) {
      const update = await this.prisma.cart.updateMany({
        where: { userid: decodedUserInfo.id, productid: id },
        data: {
          quantity: { increment: 1 },
          price: { increment: product.price },
        },
      });
      return update;
    }
    return await this.prisma.cart.create({
      data: {
        userid: decodedUserInfo.id,
        productid: id,
        price: product.price,
      },
    });
  }

  async deleteItem(id: number, req: Request, res: Response) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const item = await this.prisma.cart.findFirst({
      where: { userid: decodedUserInfo.id, productid: id },
    });
    if (!item) {
      throw new NotFoundException();
    }
    await this.prisma.cart.deleteMany({
      where: { userid: decodedUserInfo.id, productid: id },
    });
    return res.send({ message: 'item deleted successfully' });
  }

  async deleteAllItems(req: Request, res: Response) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const items = await this.prisma.cart.findMany({
      where: { userid: decodedUserInfo.id },
    });
    if (items.length === 0) {
      return res.send({ message: 'already empty' });
    }
    await this.prisma.cart.deleteMany({
      where: { userid: decodedUserInfo.id },
    });
    return res.send({ message: 'all items are deleted successfuly' });
  }

  async increaseQuantity(id: number, req: Request, res: Response) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const product = await this.productService.getOneProduct(id);

    await this.prisma.cart.updateMany({
      where: { userid: decodedUserInfo.id, productid: id },
      data: {
        quantity: { increment: 1 },
        price: { increment: product.price },
      },
    });
    return res.send({ message: 'increased successfuly' });
  }

  async decreaseQuantity(id: number, req: Request, res: Response) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const product = await this.productService.getOneProduct(id);
    const item = await this.prisma.cart.findFirst({
      where: { userid: decodedUserInfo.id, productid: id },
    });
    if (!item) {
      throw new NotFoundException();
    }
    if (item.quantity === 1) {
      await this.prisma.cart.deleteMany({
        where: { userid: decodedUserInfo.id, productid: id },
      });
    }
    await this.prisma.cart.updateMany({
      where: { userid: decodedUserInfo.id, productid: id },
      data: {
        quantity: { decrement: 1 },
        price: { decrement: product.price },
      },
    });
    return res.send({ message: 'decreased successfuly' });
  }

  async totalPrice(req: Request) {
    const decodedUserInfo = req.user as { id: string; email: string };
    const sum = await this.prisma.cart.aggregate({
      _sum: {
        price: true,
      },
      where: {
        userid: decodedUserInfo.id,
      },
    });
    return sum;
  }
}

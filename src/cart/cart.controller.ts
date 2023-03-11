import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add/:id')
  addToCart(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.cartService.addToCart(id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getItems(@Req() req) {
    return this.cartService.getitemsInCart(req);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  deleteItem(@Param('id', ParseIntPipe) id: number, @Req() req, @Res() res) {
    return this.cartService.deleteItem(id, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  deleteAllItems(@Req() req, @Res() res) {
    return this.cartService.deleteAllItems(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('quantity/increase/:id')
  increaseQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    return this.cartService.increaseQuantity(id, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('quantity/decrease/:id')
  decreaseQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    return this.cartService.decreaseQuantity(id, req, res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('total_price')
  totalPrice(@Req() req) {
    return this.cartService.totalPrice(req);
  }
}

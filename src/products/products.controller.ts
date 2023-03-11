import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  createProducts() {
    return this.productsService.createProducts();
  }

  @Get()
  allProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getOneProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneProduct(id);
  }

  @Get('filter/:category')
  filterProduct(@Param() params: { category: string }) {
    return this.productsService.filterProduct(params.category);
  }
}

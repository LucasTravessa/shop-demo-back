import { PublicEndpoint } from '@/_decorators/setters/publicEndpoint.decorator';
import { CustomSwaggerDecorator } from '@/_decorators/setters/swagger.decorator';
import { PRODUCTS_PATHS } from '@/_paths/products';
import { CreateOrUpdateProductBodyDto } from '@/_validators/products/products.dto';
import { ICreateOrUpdateProductBody } from '@/_validators/products/products.model';
import { IFindAllProductsQuery } from '@/_validators/products/products_findAll';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';

@ApiTags(PRODUCTS_PATHS.PATH_PREFIX)
@Controller(PRODUCTS_PATHS.PATH_PREFIX)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: CreateOrUpdateProductBodyDto.schema,
    },
    resDec: {
      responseSchema: CreateOrUpdateProductBodyDto.schema,
    },
    createdDec: true,
  })
  @Post()
  async create(@Body() createProductDto: ICreateOrUpdateProductBody) {
    const productRow = await this.productsService.create(createProductDto);
    return this.productsService.getProductFromDb(productRow);
  }

  @PublicEndpoint()
  @Get()
  async findAll(@Query() queryParams: IFindAllProductsQuery) {
    const productsRows = await this.productsService.findAll(queryParams);
    return productsRows.map((row) =>
      this.productsService.getProductFromDb(row),
    );
  }

  @PublicEndpoint()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const productRow = await this.productsService.findOne(+id);
    if (!productRow) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return this.productsService.getProductFromDb(productRow);
  }

  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: CreateOrUpdateProductBodyDto.schema,
    },
    resDec: {
      responseSchema: CreateOrUpdateProductBodyDto.schema,
    },
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: ICreateOrUpdateProductBody,
  ) {
    let productRow = await this.productsService.findOne(id);
    if (!productRow) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    productRow = await this.productsService.update(id, updateProductDto);
    return this.productsService.getProductFromDb(productRow);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    await this.productsService.remove(id);
  }
}

import { CurrentSystemUser } from '@/_decorators/getters/currentSystemUser.decorator';
import { OrderStatus } from '@/_enums/index';
import { OrderGuard } from '@/_guards/order.guard';
import { ORDERS_PATHS } from '@/_paths/orders';
import { ICurrentSystemUser } from '@/_validators/auth/auth.model';
import { ICreateOrUpdateOrderBody } from '@/_validators/orders/orders.model';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CustomSwaggerDecorator } from '@/_decorators/setters/swagger.decorator';
import { CreateOrUpdateOrderBodyDto } from '@/_validators/orders/orders.dto';

@Controller(ORDERS_PATHS.PATH_PREFIX)
@ApiTags(ORDERS_PATHS.PATH_PREFIX)
//!! @UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@CurrentSystemUser() { id: userId }: ICurrentSystemUser) {
    const activeOrder = await this.ordersService.findOrderForUserWithStatus(
      userId,
      OrderStatus.DRAFT,
    );
    if (activeOrder) {
      const orderRow = await this.ordersService.getApiOrder(activeOrder);
      return orderRow;
    }
    const orderRow = await this.ordersService.create(userId);
    return this.ordersService.getApiOrder(orderRow);
  }

  @UseGuards(OrderGuard)
  @Get(':orderId')
  async findOne(@Param('orderId', ParseIntPipe) orderId: number) {
    const orderRow = await this.ordersService.getCart(orderId);
    return this.ordersService.getApiOrder(orderRow);
  }

  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: CreateOrUpdateOrderBodyDto.schema,
    },
    resDec: {
      responseSchema: CreateOrUpdateOrderBodyDto.schema,
    },
  })
  @UseGuards(OrderGuard)
  @Post(':orderId/products')
  async createProduct(
    @CurrentSystemUser() { id: userId }: ICurrentSystemUser,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() addProductDto: ICreateOrUpdateOrderBody,
  ) {
    await this.ordersService.addProduct(userId, orderId, addProductDto);
    const cartWithProducts = await this.ordersService.getCart(orderId);
    await this.ordersService.reCalculateCart(cartWithProducts);
    const updatedCartRow = await this.ordersService.getCart(orderId);
    return this.ordersService.getApiOrder(updatedCartRow);
  }

  @UseGuards(OrderGuard)
  @Delete(':orderId/products/:cartId')
  async deleteProduct(
    @CurrentSystemUser() { id: userId }: ICurrentSystemUser,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('cartId', ParseIntPipe) cartId: number,
  ) {
    await this.ordersService.deleteProduct(userId, orderId, cartId);
    const cartWithProducts = await this.ordersService.getCart(orderId);
    await this.ordersService.reCalculateCart(cartWithProducts);
    const updatedCartRow = await this.ordersService.getCart(orderId);
    return this.ordersService.getApiOrder(updatedCartRow);
  }

  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: CreateOrUpdateOrderBodyDto.schema,
    },
    resDec: {
      responseSchema: CreateOrUpdateOrderBodyDto.schema,
    },
  })
  @UseGuards(OrderGuard)
  @Put(':orderId/products/:cartId')
  async updateProduct(
    @CurrentSystemUser() { id: userId }: ICurrentSystemUser,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('cartId', ParseIntPipe) cartId: number,
    @Body() updateProductDto: ICreateOrUpdateOrderBody,
  ) {
    await this.ordersService.updateProduct(
      userId,
      orderId,
      cartId,
      updateProductDto,
    );
    const cartWithProducts = await this.ordersService.getCart(orderId);
    await this.ordersService.reCalculateCart(cartWithProducts);
    const updatedCartRow = await this.ordersService.getCart(orderId);
    return this.ordersService.getApiOrder(updatedCartRow);
  }

  @UseGuards(OrderGuard)
  @Post(':orderId/purchase')
  async purchaseOrder(
    @CurrentSystemUser() { id: userId }: ICurrentSystemUser,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    await this.ordersService.purchaseOrder(userId, orderId);
    const cartWithProducts = await this.ordersService.getCart(orderId);
    return this.ordersService.getApiOrder(cartWithProducts);
  }

  @UseGuards(OrderGuard)
  @Post(':orderId/pay')
  async payOrder(
    @CurrentSystemUser() { id: userId }: ICurrentSystemUser,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    await this.ordersService.payOrder(userId, orderId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const cartWithProducts = await this.ordersService.getCart(orderId);
    return this.ordersService.getApiOrder(cartWithProducts);
  }
}

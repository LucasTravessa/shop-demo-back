import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Cart, Order, Product } from '@prisma/client';
import { ICreateOrUpdateOrderBody } from '@/_validators/orders/orders.model';
import { OrderStatus } from '@/_enums';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  async create(userId: number): Promise<Order> {
    return this.prisma.order.create({ data: { userId } });
  }

  async addProduct(
    userId: number,
    orderId: number,
    addProductDto: ICreateOrUpdateOrderBody,
  ): Promise<Cart> {
    const order = await this.findOrderForUserWithStatus(
      userId,
      OrderStatus.DRAFT,
    );
    if (!order) {
      throw new HttpException(
        'User does not have active order',
        HttpStatus.FORBIDDEN,
      );
    }

    const { productId, quantity } = addProductDto;

    const productRow = await this.prisma.product.findFirst({
      where: { id: productId },
    });

    if (productRow?.quantity ?? -1 < quantity) {
      throw new HttpException(
        'Required quantity of the product is not available',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.prisma.cart.create({
      data: { orderId, userId, productId, quantity },
    });
  }

  async deleteProduct(userId: number, orderId: number, cartId: number) {
    const order = await this.findOrderForUserWithStatus(
      userId,
      OrderStatus.DRAFT,
    );
    if (!order) {
      throw new HttpException(
        'User does not have active order',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.prisma.cart.delete({
      where: { id: cartId },
    });
  }

  async updateProduct(
    userId: number,
    orderId: number,
    cartId: number,
    updateProductDto: ICreateOrUpdateOrderBody,
  ): Promise<Cart> {
    const order = await this.findOrderForUserWithStatus(
      userId,
      OrderStatus.DRAFT,
    );
    if (!order) {
      throw new HttpException(
        'User does not have active order',
        HttpStatus.FORBIDDEN,
      );
    }

    const cartRow = await this.prisma.cart.findFirst({
      where: { id: cartId },
    });

    const productRow = await this.prisma.product.findFirst({
      where: { id: cartRow?.productId },
    });

    if (productRow?.quantity ?? -1 < updateProductDto.quantity) {
      throw new HttpException(
        'Required quantity of the product is not available',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return this.prisma.cart.update({
      where: { id: cartId },
      data: updateProductDto,
    });
  }

  async purchaseOrder(userId: number, orderId: number) {
    const order = await this.findOrderForUserWithStatus(
      userId,
      OrderStatus.DRAFT,
    );
    if (!order) {
      throw new HttpException(
        'User does not have active order',
        HttpStatus.FORBIDDEN,
      );
    }
    const orderDetail = await this.getCart(orderId);
    const cart = orderDetail?.cart ?? [];

    const promises = [];
    cart.forEach((item: Cart & { product: Product }) => {
      const { quantity, product } = item;
      const { id: productId } = product;
      const query = this.prisma.product.update({
        where: {
          id: productId,
        },
        data: { quantity: { decrement: quantity } },
      });
      promises.push(query);
    });
    const updateOrderStatus = this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: { status: OrderStatus.PURCHASED },
    });
    promises.push(updateOrderStatus);

    return this.prisma.$transaction(promises);
  }

  async payOrder(userId: number, orderId: number) {
    const order = await this.findOrderForUserWithStatus(
      userId,
      OrderStatus.PURCHASED,
    );
    if (!order) {
      throw new HttpException(
        'User does not have purchased order',
        HttpStatus.FORBIDDEN,
      );
    }

    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: { status: OrderStatus.PAID },
    });
  }

  /** *********************************
   ********* Other functions *********
   ********************************** */

  async reCalculateCart(order: any) {
    const orderDetail = { ...order };
    const { id: orderId, cart = [] } = orderDetail;
    let cartTotalPrice = 0;
    cart.forEach((item: Cart & { product: Product }) => {
      const { quantity, product } = item;
      const { price } = product;
      const totalPrice = Number(
        parseFloat(String(quantity * price)).toFixed(2),
      );
      cartTotalPrice += totalPrice;
    });
    order.totalPrice = cartTotalPrice;

    await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: { totalPrice: cartTotalPrice },
    });

    return order;
  }

  async getCart(orderId: number) {
    return this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        cart: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async isOrderBelongToCurrentUser(userId: number, orderId: number) {
    return this.prisma.order.findFirst({
      where: {
        AND: [
          {
            userId: {
              equals: userId,
            },
          },
          {
            id: {
              equals: orderId,
            },
          },
        ],
      },
    });
  }

  async findOrderForUserWithStatus(userId: number, status: OrderStatus) {
    return this.prisma.order.findFirst({
      where: {
        AND: [
          {
            userId: {
              equals: userId,
            },
          },
          {
            status: {
              equals: status,
            },
          },
        ],
      },
    });
  }

  /** ***************************************************************
   ************          Db > API transforms          ************
   **************************************************************** */

  getApiOrder(order: any): any {
    return order;
  }
}

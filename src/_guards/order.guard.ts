import { OrdersService } from '@/orders/orders.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OrderGuard implements CanActivate {
  constructor(private ordersService: OrdersService) {}
  /**
   * Verifies the order belong to the current user
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const orderId = parseInt(request.params.orderId, 10);
    const userId = request.user.userId;
    const order = await this.ordersService.isOrderBelongToCurrentUser(
      userId,
      orderId,
    );

    // if (!order) {
    // throw new HttpException(
    //   'User does not have access to this order',
    //   HttpStatus.FORBIDDEN,
    // );
    // }

    return !!order;
  }
}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PasswordModule } from './password/password.module';
import { PrismaModule } from './prisma/prisma.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './_middlewares/logger.middleware';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    PasswordModule,
    RefreshTokenModule,
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD, // https://docs.nestjs.com/recipes/passport#enable-authentication-globally
      useClass: JwtAuthGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

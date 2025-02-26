import { Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PasswordModule } from './password/password.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    PasswordModule,
    RefreshTokenModule,
    PostModule,
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
  configure(): void {
    return;
  }
  // configure(consumer: MiddlewareConsumer): void {}
}

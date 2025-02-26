/* eslint-disable @typescript-eslint/no-explicit-any */
import { CurrentSystemUser } from '@/_decorators/getters/currentSystemUser.decorator';
import { CurrentSystemUserFromRt } from '@/_decorators/getters/currentSystemUserFromRt.decorator';
import { PublicEndpoint } from '@/_decorators/setters/publicEndpoint.decorator';
import { CustomSwaggerDecorator } from '@/_decorators/setters/swagger.decorator';
import { AUTH_PATHS } from '@/_paths/auth';
import {
  LoginBodyDto,
  LoginUserResponseDto,
  RefreshTokenResponseDto,
  RegisterUserBodyDto,
  RegisterUserResponseDto,
  ResetPasswordBodyDto,
} from '@/_validators/auth/auth.dto';
import {
  ICurrentSystemUser,
  ICurrentSystemUserIdWithRt,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '@/_validators/auth/auth.model';
import { IApiResponse } from '@/_validators/global/global.model';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { ZodSerializerDto } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags(AUTH_PATHS.PATH_PREFIX)
@Controller(AUTH_PATHS.PATH_PREFIX)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: RegisterUserBodyDto.schema,
    },
    resDec: {
      responseSchema: RegisterUserResponseDto.schema,
    },
    conflictDec: true,
    createdDec: true,
  })
  @PublicEndpoint()
  @Post(AUTH_PATHS.REGISTER)
  @ZodSerializerDto(RegisterUserResponseDto)
  public async register(
    @Body() registerPayload: RegisterUserBodyDto,
  ): Promise<IApiResponse<User>> {
    return {
      message: 'success',
      data: await this.authService.register(registerPayload),
    };
  }

  // Login
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: LoginBodyDto.schema,
    },
    resDec: {
      responseSchema: LoginUserResponseDto.schema,
    },
    statusOK: true,
  })
  @PublicEndpoint()
  @Post(AUTH_PATHS.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(LoginUserResponseDto)
  public async login(
    @Body() loginPayload: LoginBodyDto,
  ): Promise<IApiResponse<ILoginUserResponse>> {
    return {
      message: 'success',
      data: await this.authService.login(loginPayload),
    };
  }

  // Logout
  @CustomSwaggerDecorator({
    authDec: true,
    unauthDec: true,
    statusOK: true,
  })
  @Post(AUTH_PATHS.LOGOUT)
  @HttpCode(HttpStatus.OK)
  public async logout(
    @CurrentSystemUser() { id }: ICurrentSystemUser,
  ): Promise<IApiResponse<string>> {
    return {
      message: 'success',
      data: await this.authService.logout(id),
    };
  }

  // Refresh token
  @CustomSwaggerDecorator({
    resDec: {
      responseSchema: RefreshTokenResponseDto.schema,
    },
    authDec: true,
    unauthDec: true,
    statusOK: true,
  })
  @PublicEndpoint()
  @UseGuards(JwtRefreshGuard)
  @Post(AUTH_PATHS.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(RefreshTokenResponseDto)
  public async refreshToken(
    @CurrentSystemUserFromRt() { id, refreshToken }: ICurrentSystemUserIdWithRt,
  ): Promise<IApiResponse<IRefreshTokenResponse>> {
    return {
      message: 'success',
      data: await this.authService.refreshToken({
        id,
        refreshToken,
      }),
    };
  }

  // Reset password & verify otp
  @CustomSwaggerDecorator({
    bodyDec: {
      payloadSchema: ResetPasswordBodyDto.schema,
    },
    statusOK: true,
  })
  @PublicEndpoint()
  @Post(AUTH_PATHS.POST_RESET_PASSWORD)
  @HttpCode(HttpStatus.OK)
  public async resetPassword(
    @Body()
    { email, newPassword, confirmNewPassword }: ResetPasswordBodyDto,
  ): Promise<IApiResponse<string>> {
    await this.authService.resetPassword({
      email,
      newPassword,
      confirmNewPassword,
    });

    return {
      message: 'Password reset success.',
    };
  }
}

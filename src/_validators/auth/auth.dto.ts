import { createZodDto } from 'nestjs-zod';
import {
  changePasswordBodySchema,
  loginBodySchema,
  loginUserResponseSchema,
  refreshTokenResponseSchema,
  registerUserBodySchema,
  registerUserResponseSchema,
  resetPasswordSchema,
} from './auth.schema';

export class RegisterUserBodyDto extends createZodDto(registerUserBodySchema) {}

export class LoginBodyDto extends createZodDto(loginBodySchema) {}

export class RegisterUserResponseDto extends createZodDto(
  registerUserResponseSchema,
) {}

export class LoginUserResponseDto extends createZodDto(
  loginUserResponseSchema,
) {}

export class RefreshTokenResponseDto extends createZodDto(
  refreshTokenResponseSchema,
) {}

export class ChangePasswordBodyDto extends createZodDto(
  changePasswordBodySchema,
) {}

export class ResetPasswordBodyDto extends createZodDto(resetPasswordSchema) {}

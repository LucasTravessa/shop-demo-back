import { UserStatus, UserType } from '@prisma/client';
import { z } from 'zod';
import {
  IChangePasswordBody,
  ILoginBody,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IRegisterUserBody,
  IRegisterUserResponse,
  IResetPasswordBody,
} from './auth.model';

export const registerUserBodySchema: z.ZodSchema<IRegisterUserBody> = z
  .object({
    firstName: z
      .string({
        required_error: 'firstName is required',
      })
      .min(3, 'must be at least 3 characters')
      .max(12, 'must not exceed 12 characters'),
    lastName: z
      .string({
        required_error: 'lastName is required',
      })
      .min(3, 'must be at least 3 characters')
      .max(12, 'must not exceed 12 characters'),
    email: z
      .string({
        required_error: 'email is required',
      })
      .email(),
    password: z
      .string({
        required_error: 'password is required',
      })
      .min(8, 'must be at least 8 characters')
      .max(32, 'must not exceed 32 characters'),
  })
  .strip();

export const loginBodySchema: z.ZodSchema<ILoginBody> = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .strip();

export const registerUserResponseSchema: z.ZodSchema<IRegisterUserResponse> =
  z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    image: z.string().nullable(),
    dateOfBirth: z.date().nullable(),
    type: z.nativeEnum(UserType),
    status: z.nativeEnum(UserStatus),
    bio: z.string().nullable(),
    created: z.date(),
    updated: z.date(),
  });

export const loginUserResponseSchema: z.ZodSchema<ILoginUserResponse> =
  z.object({
    user: z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      image: z.string().nullable(),
      dateOfBirth: z.date().nullable(),
      type: z.nativeEnum(UserType),
      status: z.nativeEnum(UserStatus),
      bio: z.string().nullable(),
      created: z.date(),
      updated: z.date(),
    }),
    tokens: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      accessTokenExpiresIn: z.number(),
    }),
  });

export const refreshTokenResponseSchema: z.ZodSchema<IRefreshTokenResponse> =
  z.object({
    user: z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      image: z.string().nullable(),
      dateOfBirth: z.date().nullable(),
      type: z.nativeEnum(UserType),
      status: z.nativeEnum(UserStatus),
      bio: z.string().nullable(),
      created: z.date(),
      updated: z.date(),
    }),
    tokens: z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      accessTokenExpiresIn: z.number(),
    }),
  });

// Change password schema
export const changePasswordBodySchema: z.ZodSchema<IChangePasswordBody> = z
  .object({
    email: z
      .string()
      .email()
      .transform((value) => value.toLowerCase()),
    password: z.string().min(8, 'must be at least 8 characters'),
    newPassword: z.string().min(8, 'must be at least 8 characters'),
    confirmNewPassword: z.string().min(8, 'must be at least 8 characters'),
  })
  .superRefine((val, ctx) => {
    // first issue

    if (val.newPassword !== val.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '"new password" and "confirm new password" must match',
        path: ['confirmPassword'],
      });
    }

    // second issue

    if (val.newPassword === val.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `"password" and "new password" must not match`,
        path: ['newPassword'],
      });
    }
  });

// Reset password schema
export const resetPasswordSchema: z.ZodSchema<IResetPasswordBody> = z
  .object({
    email: z
      .string()
      .email()
      .transform((value) => value.toLowerCase()),
    newPassword: z.string().min(8, 'must be at least 8 characters'),
    confirmNewPassword: z.string().min(8, 'musr be at least 8 characters'),
  })
  .superRefine((val, ctx) => {
    // first issue

    if (val.newPassword !== val.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '"new password" and "confirm new password" must match',
      });
    }
  });

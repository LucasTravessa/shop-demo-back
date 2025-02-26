/* eslint-disable @typescript-eslint/no-empty-object-type */
import { User } from '@prisma/client';
import { Request } from 'express';

export type ITokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
};

export type ICurrentSystemUser = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'email' | 'type' | 'status' | 'image'
>;

export interface IAuthenticatedRequest extends Request {
  user: ICurrentSystemUser;
}

export type AccessOrRefreshJwtPayload = {
  sub: User['id'];
};

export type AccessOrRefreshJwtPayloadJwtPayloadDecoded =
  AccessOrRefreshJwtPayload & {
    iat: number;
    exp: number;
  };
export type ICurrentSystemUserId = Pick<User, 'id'>;

export type ICurrentSystemUserIdWithRt = ICurrentSystemUserId & {
  refreshToken: string;
};

export interface IAuthenticatedRequestWithRt extends Request {
  user: ICurrentSystemUserIdWithRt;
}

export type VerifyEmailJwtPayload = Pick<User, 'email'> & {
  sub: User['id'];
};

export type VerifyEmailJwtPayloadDecoded = VerifyEmailJwtPayload & {
  iat: number;
  exp: number;
};

export interface IRegisterUserBody
  extends Pick<User, 'firstName' | 'lastName' | 'email'> {
  password: string;
}

export interface ILoginBody extends Pick<User, 'email'> {
  password: string;
}

export interface IVerifyEmailBody {
  email: string;
}

export interface IChangePasswordBody {
  email: string;
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IResetPasswordBody {
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

/*************  Responses  ***************/
export interface IRegisterUserResponse extends User {}

export interface ILoginUserResponse {
  user: User;
  tokens: ITokens;
}

export interface IRefreshTokenResponse extends ILoginUserResponse {}

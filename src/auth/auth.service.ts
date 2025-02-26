/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HashService } from '@/_utils/hash.util';
import {
  ILoginBody,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IRegisterUserBody,
  IResetPasswordBody,
  ITokens,
} from '@/_validators/auth/auth.model';
import { PasswordService } from '@/password/password.service';
import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import { UserService } from '@/user/user.service';
import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly passwordService: PasswordService,
  ) {}

  // Register
  public async register(registerPayload: IRegisterUserBody): Promise<User> {
    const createdUser = await this.userService.createUserOrThrow({
      firstName: registerPayload.firstName,
      lastName: registerPayload.lastName,
      email: registerPayload.email,
      password: registerPayload.password,
    });

    Logger.log(`AuthService: user with email: ${createdUser.email} created`);

    return createdUser;
  }

  // Login
  public async login(loginPayload: ILoginBody): Promise<ILoginUserResponse> {
    const user = await this.userService.getUserByEmailOrNull(
      loginPayload.email,
    );

    if (!user) {
      Logger.error(`user with email: ${loginPayload.email} not found`);

      return Promise.reject(new UnauthorizedException(`AuthService: login1`));
    }

    // get user password
    const userPassword = await this.passwordService.getUserPasswordbyIdOrNull(
      user.id,
    );

    if (!userPassword) {
      Logger.error(`user password with email: ${loginPayload.email} not found`);

      return Promise.reject(new UnauthorizedException(`AuthService: login2`));
    }

    const passwordMatches = HashService.compareHash({
      storedHash: userPassword.hash,
      storedSalt: userPassword.salt,
      tobeHashed: loginPayload.password,
    });

    if (!passwordMatches) {
      Logger.error(`user password with email: ${loginPayload.email} not match`);

      return Promise.reject(new UnauthorizedException(`AuthService: login3`));
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.refreshTokenService.createOrUpdateRefreshToken({
      userId: user.id,
      newRt: tokens.refreshToken,
    });

    await this.userService.updateUserStatusToActive(user.id);

    return {
      user,
      tokens,
    };
  }

  // Logout
  public async logout(userId: number): Promise<string> {
    await this.refreshTokenService.deleteRefreshTokenByUserId(userId);

    return `Logged out successfully`;
  }

  // Refresh token
  public async refreshToken({
    id,
    refreshToken,
  }: {
    id: number;
    refreshToken: string;
  }): Promise<IRefreshTokenResponse> {
    const user = await this.userService.getUserByIdOrNull(id);

    if (!user) {
      return Promise.reject(
        new UnauthorizedException(`AuthService: user not found refreshToken1`),
      );
    }

    const userRT =
      await this.refreshTokenService.getRefreshTokenByUserIdOrNull(id);

    if (!userRT) {
      return Promise.reject(
        new ForbiddenException(
          `AuthService: refreshToken not found refreshToken2`,
        ),
      );
    }

    const rtMatches = HashService.compareHash({
      storedHash: userRT.hash,
      storedSalt: userRT.salt,
      tobeHashed: refreshToken,
    });

    if (!rtMatches) {
      return Promise.reject(
        new ForbiddenException(
          `AuthService: refreshToken not match refreshToken 3`,
        ),
      );
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.refreshTokenService.createOrUpdateRefreshToken({
      userId: user.id,
      newRt: tokens.refreshToken,
    });

    return {
      user,
      tokens,
    };
  }

  // Generate access & refresh tokens
  private async generateTokens(
    userId: number,
    email: string,
  ): Promise<ITokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConstants.jwtSecret,
          expiresIn: jwtConstants.accessTokenExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConstants.jwtRefreshSecret,
          expiresIn: jwtConstants.refreshTokenExpiresIn,
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
      accessTokenExpiresIn: jwtConstants.accessTokenExpiresIn,
    };
  }

  // Reset password
  public async resetPassword({
    email,
    newPassword,
  }: IResetPasswordBody): Promise<void> {
    const user = await this.userService.getUserByEmailOrNull(email);

    if (!user) {
      return Promise.reject(
        new ForbiddenException('AuthService: resetPassword1'),
      );
    }

    await this.passwordService.checkIfPasswordIsNewOrThrow({
      userId: user.id,
      plainTextPassword: newPassword,
    });

    await this.passwordService.hashThenCreateOrUpdatePassword({
      userId: user.id,
      plainTextPassword: newPassword,
    });
  }
}

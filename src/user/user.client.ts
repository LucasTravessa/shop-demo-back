import { IGetUserByIdResponse } from '@/_validators/user/user.model';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Prisma, User, UserStatus } from '@prisma/client';

@Injectable()
export class UserClient {
  constructor(private readonly prisma: PrismaService) {}

  // Check if user exists by email
  public async checkIfUserExistsByEmail(
    email: User['email'],
  ): Promise<boolean> {
    const userExist = await this.prisma.user.count({
      where: {
        email: email.toLowerCase(),
      },
    });

    return userExist === 1 ? true : false;
  }

  // Create user or throw
  public async createUserOrThrow({
    firstName,
    lastName,
    email,
  }: Pick<User, 'firstName' | 'lastName' | 'email'>): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          firstName,
          lastName,
          email: email.toLowerCase(),
        },
      });

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return Promise.reject(
            new InternalServerErrorException(
              `UserClient: user with email: ${email} already exists`,
            ),
          );
        }

        return Promise.reject(
          new InternalServerErrorException(
            `UserClient: error occured while creating user with email: ${email} with error code: ${e.code}`,
          ),
        );
      }

      return Promise.reject(
        new InternalServerErrorException(
          `UserClient: error occured while creating user with email: ${email}`,
        ),
      );
    }
  }

  // Get user by email or null
  public async getUserByEmailOrNull(
    email: User['email'],
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  // Update user status to active
  public async updateUserStatusToActiveOrThrow(
    userId: User['id'],
  ): Promise<void> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          status: UserStatus.ACTIVE,
        },
      });

      if (!user) {
        return Promise.reject(
          new InternalServerErrorException(
            `UserClient: failed to update user status to active`,
          ),
        );
      }
    } catch (e) {
      Logger.error(e, 'UserClient: updateUserStatusToActiveOrThrow');

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return Promise.reject(
          new InternalServerErrorException(
            `UserClient: failed to update user status with error code: ${e.code}`,
          ),
        );
      }

      return Promise.reject(
        new InternalServerErrorException(
          `UserClient: failed to update user status`,
        ),
      );
    }
  }

  // Get user by id or null
  public async getUserByIdOrNull(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  // Get all users
  public async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Get user by id
  public async getUserById(
    id: User['id'],
  ): Promise<IGetUserByIdResponse | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        type: true,
      },
    });
  }
}

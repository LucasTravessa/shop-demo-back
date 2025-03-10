import { IGetUserByIdResponse } from '@/_validators/user/user.model';
import { PasswordService } from '@/password/password.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserClient } from './user.client';

@Injectable()
export class UserService {
  constructor(
    private readonly userClient: UserClient,
    private readonly passwordService: PasswordService,
  ) {}

  // Create user or throw
  public async createUserOrThrow({
    firstName,
    lastName,
    email,
    password: plainTextPassword,
  }: Pick<User, 'firstName' | 'lastName' | 'email'> & {
    password: string;
  }): Promise<User> {
    await this.checkIfUserExistsByEmail(email);

    const createdUser = await this.userClient.createUserOrThrow({
      firstName,
      lastName,
      email,
    });

    await this.passwordService.hashThenCreateOrUpdatePassword({
      userId: createdUser.id,
      plainTextPassword,
    });

    return createdUser;
  }

  // Check if user exists by email
  public async checkIfUserExistsByEmail(email: User['email']): Promise<void> {
    const userExist = await this.userClient.checkIfUserExistsByEmail(email);

    if (userExist) {
      return Promise.reject(
        new ConflictException(
          `UserService: user with email ${email} already exist`,
        ),
      );
    }
  }

  // Get user by email or null
  public async getUserByEmailOrNull(
    email: User['email'],
  ): Promise<User | null> {
    return this.userClient.getUserByEmailOrNull(email);
  }

  // Update user status to active
  public async updateUserStatusToActive(userId: User['id']): Promise<void> {
    return this.userClient.updateUserStatusToActiveOrThrow(userId);
  }

  // Get user by id or null
  public async getUserByIdOrNull(userId: number): Promise<User | null> {
    return this.userClient.getUserByIdOrNull(userId);
  }

  // Get all users
  public async getAllUsers(): Promise<User[]> {
    return this.userClient.getAllUsers();
  }

  // Get user by id
  public async getUserById(
    id: User['id'],
  ): Promise<IGetUserByIdResponse | null> {
    return this.userClient.getUserById(id);
  }
}

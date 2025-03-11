import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import {
  comparePasswords,
  errorMessage,
  generateHashedPassword,
  generateUsername
} from 'src/shared/utils';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
  ) { }

  async createUser({ user }: { user: Partial<User> }) {
    try {
      const userExists = await this.databaseService.getUser({
        userEmailOrId: user?.email,
      });

      const lastLoginAt = new Date();

      if (userExists) throw new BadRequestException('User already registered!');
      const password = generateHashedPassword(user.password);
      const newUser = await this.databaseService.createUser({
        payload: { ...user, password, lastLoginAt } as User,
      });

      const username = generateUsername(false, user?.name, newUser?.userId)
      await this.databaseService.updateUser({
        userId: user?.userId,
        payload: {
          username
        }
      })
      return { ...newUser, username, password: null };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async getUser({ userEmailOrId }: { userEmailOrId: string }) {
    try {
      const user = await this.databaseService.getUser({ userEmailOrId });
      if (!user) throw new NotFoundException('User not found!');
      // const portfolios = await this.databaseService.getUserPortfolios({
      //   userId: user.userId,
      // });
      return {
        ...user,
        password: null,
        // portfolios,
      };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async updateUser({
    payload,
    userId,
  }: {
    payload: Partial<User>;
    userId: string;
  }) {
    try {
      let updatedData = { ...payload };

      if (payload?.password) {
        updatedData = {
          ...updatedData,
          password: generateHashedPassword(payload?.password),
        };
      }

      const user = await this.databaseService.updateUser({
        userId,
        payload: updatedData,
      });

      return { ...user, password: null };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }


  async updateUserPassword({
    userId,
    currentPassword,
    newPassword,
  }: {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }) {
    try {
      const user = await this.databaseService.getUser({
        userEmailOrId: userId,
      });

      if (!user) throw new NotFoundException('User not found');

      const validPassword = comparePasswords(currentPassword, user.password);
      if (!validPassword)
        throw new BadRequestException('Current password is invalid!');

      const password = generateHashedPassword(newPassword);
      await this.databaseService.updateUser({
        userId: user.userId,
        payload: {
          password,
        },
      });
      return { message: 'Password updated successfully!' };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }
}

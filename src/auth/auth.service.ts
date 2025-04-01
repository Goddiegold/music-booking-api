import {
  BadRequestException,
  HttpException,
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
  generateOtp,
} from 'src/common/utils';

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}

  async loginUserLocal({ user }: { user: Partial<User> }) {
    try {
      const userExists = await this.databaseService.getUser({
        userEmailOrId: user.email,
      });
      console.log('userExists', userExists);

      if (!userExists) throw new NotFoundException('User not registered!');
      const validPassword = comparePasswords(
        user?.password,
        userExists?.password,
      );

      if (!validPassword)
        throw new BadRequestException('Incorrect email or password!');

      const lastLoginAt = new Date();

      await this.databaseService.updateUser({
        userId: userExists.userId,
        payload: {
          lastLoginAt,
        },
      });

      return { ...userExists, password: null };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async requestToResetPassword({ email }: { email: string }) {
    try {
      const userExist = await this.databaseService.getUser({
        userEmailOrId: email,
      });
      if (!userExist) throw new NotFoundException('User not found!');

      const { duration: otlDuration, otp: otl } = generateOtp();
      await this.databaseService.updateUser({
        userId: userExist.userId,
        payload: {
          otl,
          otlDuration: new Date(otlDuration),
        },
      });

      return {
        message: `Make a Patch request to /api/auth/reset-password/${otl}!`,
      };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async completeResetPassword({
    otl,
    newPassword,
  }: {
    otl: string;
    newPassword: string;
  }) {
    try {
      const otlUser = await this.databaseService.getUserByOtl({ otl });
      if (!otlUser) throw new NotFoundException('Invalid or Expired Link!');
      const password = generateHashedPassword(newPassword);

      await this.databaseService.updateUser({
        userId: otlUser.userId,
        payload: {
          password,
          otl: null,
          otlDuration: null,
        },
      });

      return { message: 'Password updated successfully!' };
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }
}

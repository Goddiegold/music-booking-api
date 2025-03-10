import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Config } from 'src/config';
import { DatabaseService } from 'src/database/database.service';
import {
  comparePasswords,
  errorMessage,
  generateHashedPassword,
  generateOtp,
} from 'src/shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async loginUserLocal({ user }: { user: User }) {
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

  async createUserWithSSO({
    userData,
    provider,
  }: {
    userData: Partial<User>;
    provider: string;
  }) {
    try {
      const user = await this.databaseService.getUser({
        userEmailOrId: userData?.email,
      });

      const lastLoginAt = new Date();

      if (user) {
        const authProvidersSet = new Set(user.authProviders);
        const authProviders = Array.from(authProvidersSet.add(provider));

        await this.databaseService.updateUser({
          userId: user.userId,
          payload: { authProviders, lastLoginAt },
        });

        const token = this.jwtService.sign({ userId: user.userId });

        return `${Config.WEB_CLIENT}?token=${token}`;
      }

      const newUser = await this.databaseService.createUser({
        payload: {
          ...userData,
          authProviders: [provider],
          lastLoginAt,
        } as User,
      });

      const token = this.jwtService.sign({ userId: newUser.userId });
      return `${Config.WEB_CLIENT}?token=${token}`;
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

      return { message: 'Check your mail!' };
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

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { isValidObjectId } from 'src/shared/utils';

@Injectable()
export class DatabaseService {
  constructor(private prisma: PrismaService) { }
  async createUser({ payload }: { payload: User }) {
    const newUser = await this.prisma.user.create({
      data: {
        ...payload,
      },
    });

    return newUser;
  }

  async getUser({ userEmailOrId }: { userEmailOrId: string }) {
    const OR = [];

    OR.push({ email: userEmailOrId });

    if (isValidObjectId(userEmailOrId)) {
      OR.push({ userId: userEmailOrId });
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR,
      },
    });

    return user;
  }
}

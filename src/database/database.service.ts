import { Injectable } from '@nestjs/common';
import { Conversation, Message, User } from '@prisma/client';
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

  async updateUser({
    userId,
    payload,
  }: {
    userId: string;
    payload: Partial<User>;
  }) {
    const updatedUser = await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        ...payload,
      },
    });

    return updatedUser;
  }

  async createConversation({ conversation }: { conversation: Conversation }) {
    const newConvo = await this.prisma.conversation.create({
      data: {
        ...conversation,
      },
    });

    return newConvo;
  }

  async getUserConvos({
    userId,
    withMessages = false,
  }: {
    userId: string;
    withMessages?: boolean;
  }) {
    let include = {};
    if (withMessages) {
      include = { messages: true };
    }
    const convos = await this.prisma.conversation.findMany({
      ...include,
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return convos;
  }

  async delConvo({ conversationId }: { conversationId: string }) {
    const convo = await this.prisma.conversation.delete({
      where: {
        conversationId,
      },
    });

    return convo;
  }

  async createMessage({ message }: { message: Message }) {
    const newMessage = await this.prisma.message.create({
      data: {
        ...message,
      },
    });

    return newMessage;
  }

  async deleteMessage({ messageId }: { messageId: string }) {
    const message = await this.prisma.message.delete({
      where: {
        messageId,
      },
    });

    return message;
  }

  async getConversation({
    conversationId,
    withMessages,
  }: {
    conversationId: string;
    withMessages?: boolean;
  }) {
    let include = {};

    if (withMessages) {
      include = { messages: true };
    }

    const collection = await this.prisma.conversation.findFirst({
      ...include,
      where: {
        conversationId,
      },
    });

    return collection;
  }

  async updateConversation({
    conversationId,
    payload,
  }: {
    conversationId: string;
    payload: Partial<Conversation>;
  }) {
    const conversation = await this.prisma.conversation.update({
      where: {
        conversationId,
      },
      data: {
        ...payload
      }
    })
    return conversation;
  }
}

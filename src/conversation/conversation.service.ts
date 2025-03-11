import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Conversation } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { errorMessage, wetroCloudAxiosInstance } from 'src/shared/utils';

@Injectable()
export class ConversationService {
  constructor(private databaseService: DatabaseService) { }

  async startConvoversation({ conversation }: { conversation: Conversation }) {
    try {
      const res = await wetroCloudAxiosInstance.post('/create/', {});
      console.log('create collection on wetrocloud', res);

      const collection_id = res?.data?.collection_id;
      const convo = await this.databaseService.createConversation({
        conversation: { ...conversation, collection_id },
      });
      return convo;
    } catch (e) {
      throw new InternalServerErrorException(errorMessage(e));
    }
  }

  async getUserConversations({
    userId,
    withMessages,
  }: {
    userId: string;
    withMessages?: boolean;
  }) {
    try {
      const conversations = await this.databaseService.getUserConvos({
        userId,
        withMessages,
      });

      return conversations;
    } catch (e) {
      throw new InternalServerErrorException(errorMessage(e));
    }
  }

  async updateConversation({
    conversation: payload,
  }: {
    conversation: Partial<Conversation>;
  }) {
    try {
      const conversationId = payload?.conversationId;
      const payloadResource = payload?.resource;
      const payloadType = payload?.type;

      const currentConversation = await this.databaseService.getConversation({
        conversationId,
      });

      if (!currentConversation)
        throw new NotFoundException(
          `Conversation [${conversationId}] not found!`,
        );

      const conversationResource = currentConversation?.resource;
      const conversationType = currentConversation?.resource;

      if (
        conversationResource !== payloadResource ||
        conversationType !== payloadType
      ) {
        const collection_id = currentConversation?.collection_id;

        const res = await wetroCloudAxiosInstance.post('/insert/', {
          collection_id,
          resource: payloadResource,
          type: payloadType,
        });
        console.log('insert collection to wetrocloud', res?.data);
      }

      const updatedConvo = await this.databaseService.updateConversation({
        conversationId,
        payload: {
          resource: payloadResource,
          type: payloadType,
          title: payload?.title || currentConversation?.title,
        },
      });

      return updatedConvo;
    } catch (e) {
      throw new InternalServerErrorException(errorMessage(e));
    }
  }

  async queryResources({
    conversationId,
    query,
  }: {
    conversationId: string;
    query: string;
  }) {
    try {
      const currentConversation = await this.databaseService.getConversation({
        conversationId,
      });

      if (!currentConversation)
        throw new NotFoundException(
          `Conversation [${conversationId}] not found!`,
        );

      const userMessage = {
        content: query,
        conversationId,
      };

      const res = await wetroCloudAxiosInstance.post('/query/', {
        collection_id: currentConversation?.collection_id,
        request_query: query,
      });

      const modelResponse = {
        content: res?.data?.response,
        conversationId,
      };

      const [_, modelResponseMessage] = await Promise.all([
        await this.databaseService.createMessage({ message: userMessage }),
        await this.databaseService.createMessage({ message: modelResponse }),
      ]);

      return modelResponseMessage;
    } catch (e) {
      throw new InternalServerErrorException(errorMessage(e));
    }
  }

  async deleteConversation({
    conversationId,
    userId,
  }: {
    conversationId: string;
    userId: string;
  }) {
    try {
      const conversation = await this.databaseService.getConversation({
        conversationId,
      });

      if (!conversation)
        throw new NotFoundException(
          `Conversation ${conversationId} not found!`,
        );

      if (userId !== conversation?.userId) {
        throw new UnauthorizedException('Forbidden to perform this acton!');
      }

      return await this.databaseService.delConvo({ conversationId });
    } catch (e) {
      throw new InternalServerErrorException(errorMessage(e));
    }
  }

  async getConversation({
    conversationId,
    withMessages,
  }: {
    conversationId: string;
    withMessages?: boolean;
  }) {
    try {
      const conversation = await this.databaseService.getConversation({
        conversationId,
        withMessages,
      });

      if (!conversation)
        throw new NotFoundException(
          `Conversation ${conversationId} not found!`,
        );

      return conversation;
    } catch (e) {
      throw new InternalServerErrorException(errorMessage(e));
    }
  }
}

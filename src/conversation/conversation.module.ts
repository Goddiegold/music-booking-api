import { Module } from '@nestjs/common';
import { MessageController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationGateway } from './conversation.gateway';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MessageController],
  providers: [ConversationService, ConversationGateway, PrismaService]
})
export class ConversationModule {}

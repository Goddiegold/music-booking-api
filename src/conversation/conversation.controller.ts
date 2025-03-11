import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Conversation, User } from 'prisma/prisma-client';
import { CurrentUser } from 'src/shared/decorators';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { ResponseBody } from 'src/types';
import { UpdateConversationDTO } from 'src/dto';

@Controller('/api/conversation')
export class MessageController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('/all')
  @UseGuards(JwtAuthGuard)
  async getConversations(
    @CurrentUser() user: User,
  ): Promise<ResponseBody<Conversation[]>> {
    const result = await this.conversationService.getUserConversations({
      userId: user?.userId,
    });
    if (result) return { result };
  }

  @Delete('/:conversationId')
  @UseGuards(JwtAuthGuard)
  async deleteConversation(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: User,
  ): Promise<ResponseBody<Conversation>> {
    const result = await this.conversationService.deleteConversation({
      conversationId,
      userId: user?.userId,
    });
    if (result) return { result };
  }

  @Get('/:conversationId')
  @UseGuards(JwtAuthGuard)
  async getConversation(
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: User,
    @Query('withMessages') withMessages?: string,
  ): Promise<ResponseBody<Conversation>> {
    const result = await this.conversationService.getConversation({
      conversationId,
      withMessages: withMessages === 'true',
    });
    if (result) return { result };
  }

  @Patch('/:conversationId')
  @UseGuards(JwtAuthGuard)
  async updateConversation(
    @Param('conversationId') conversationId: string,
    @Body() body: UpdateConversationDTO,
  ): Promise<ResponseBody<Conversation>> {
    const result = await this.conversationService.updateConversation({
      conversation: {
        ...body,
        conversationId,
      },
    });
    if (result) return { result };
  }
}

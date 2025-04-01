import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Event, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ResponseBody } from 'src/types';
import { EventService } from './event.service';
import { CurrentUser } from 'src/common/decorators';

@Controller('api/event')
export class UserController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllEvents(): Promise<ResponseBody<Event[]>> {
    const result = await this.eventService.getEvents();
    if (result) return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  async getMyEvents(
    @CurrentUser() currentUser: User,
  ): Promise<ResponseBody<Event[]>> {
    const userId = currentUser?.userId;
    const userRole = currentUser?.role;
    const result = await this.eventService.getMyEvents({
      userRole,
      organizerOrArtistId: userId,
    });
    if (result) return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createEvent(@Body() body): Promise<ResponseBody<Event>> {
    const result = await this.eventService.createEvent({ event: body });
    return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:eventId')
  async getEvent(
    @Req() req,
    @Param('eventId') eventId: string,
  ): Promise<ResponseBody<Event>> {
    const result = await this.eventService.getEvent({ eventId });
    if (result) return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:eventId')
  async updateEvent(
    @Param('eventId') eventId: string,
    @Body() body,
  ): Promise<ResponseBody<Event>> {
    const result = await this.eventService.updateEvent({
      eventId,
      event: body,
    });
    if (result) return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':/eventId')
  async deleteEvent(
    @Param('eventId') eventId: string,
  ): Promise<ResponseBody<Partial<Event>>> {
    const result = await this.eventService.deleteEvent({ eventId });
    if (result) return { result };
  }
}

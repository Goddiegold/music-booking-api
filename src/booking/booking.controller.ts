import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Booking, User, user_role } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ResponseBody } from 'src/types';
import { BookingService } from './booking.service';
import { CurrentUser, Roles} from 'src/common/decorators';
import { RBACGuard } from 'src/guards/rbac.guard';

@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyBookings(@CurrentUser() currentUser: User) {
    const userRole = currentUser?.role;
    const userId = currentUser?.userId;
    const result = await this.bookingService.getMyBookings({
      userRole,
      organizerOrArtisteId: userId,
    });
    return { result };
  }

  @UseGuards(JwtAuthGuard, RBACGuard)
  @Roles(user_role.event_organizer)
  @Post('/:eventId')
  async createBooking(
    @Body() body,
    @Param('eventId') eventId: string,
  ): Promise<ResponseBody<Booking>> {
    const result = await this.bookingService.createBooking({
      eventId,
      artistId: body?.artistId,
    });

    if (result) return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:bookingId')
  async getBooking(@Param('bookingId') bookingId: string) {
    const result = await this.bookingService.getBooking({
      bookingId,
    });
    if (result) return { result };
  }

  @UseGuards(JwtAuthGuard, RBACGuard)
  @Roles(user_role.event_organizer)
  @UseGuards(JwtAuthGuard)
  @Delete('/:bookingId')
  async deleteBooking(
    @Param('bookingId') bookingId: string,
    @CurrentUser() currentUser: User,
  ) {
    const userId = currentUser?.userId;
    const result = await this.bookingService.deleteBooking({
      bookingId,
      currentUserId: userId,
    });
    if (result) return { result };
  }


  @UseGuards(JwtAuthGuard, RBACGuard)
  @Roles(user_role.artist)
  @Post('/:bookingId')
  async decideOnBooking(
    @Param('bookingId') bookingId: string,
    @Body() body,
    @CurrentUser() currentUser: User,
  ) {
    const result = await this.bookingService.decideOnBooking({
      bookingId,
      status: body?.status,
      currentUserId: currentUser?.userId,
    });
    if (result) return { result };
  }

  
}

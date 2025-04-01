import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Booking, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ResponseBody } from 'src/types';
import { BookingService } from './booking.service';
import { CurrentUser } from 'src/common/decorators';

@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:bookingId')
  async deleteBooking(@Param('bookingId') bookingId: string) {
    const result = await this.bookingService.getBooking({
      bookingId,
    });
    if (result) return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:bookingId')
  async decideOnBooking(@Param('bookingId') bookingId: string, @Body() body) {
    const result = await this.bookingService.decideOnBooking({
      bookingId,
      status: body?.status,
    });
    if (result) return { result };
  }

  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMyBookings(@CurrentUser() currentUser: User) {
    const userRole = currentUser?.role;
    const userId = currentUser?.userId;
    const result = await this.bookingService.getMyBookings({
      userRole,
      organizerOrArtisteId: userId,
    });
    return { result }
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { booking_status, user_role } from '@prisma/client';
import { errorMessage } from 'src/common/utils';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BookingService {
  constructor(private databaseService: DatabaseService) {}

  async createBooking({
    artistId,
    eventId,
  }: {
    artistId: string;
    eventId: string;
  }) {
    try {
      const existingBooking = await this.databaseService.getArtistEventBooking({
        eventId,
        artistId,
      });
      if (existingBooking) {
        throw new BadRequestException(
          `Artist [${artistId}] already booked for event [${eventId}]!`,
        );
      }
      return this.databaseService.createBooking({ eventId, artistId });
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async getBooking({ bookingId }: { bookingId: string }) {
    try {
      const booking = this.databaseService.getBooking({ bookingId });

      if (!booking)
        throw new NotFoundException(`Booking ${[bookingId]} not found!`);

      return booking;
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async deleteBooking({
    bookingId,
    currentUserId,
  }: {
    bookingId: string;
    currentUserId: string;
  }) {
    try {
      const booking = await this.databaseService.getBooking({ bookingId });

      if (!booking)
        throw new NotFoundException(`Booking [${bookingId}] not found!`);

      if (currentUserId !== booking.event.organizerId) {
        throw new ForbiddenException("You can't perform this action!");
      }

      const deletedBooking = await this.databaseService.deleteBooking({
        bookingId,
      });
      return deletedBooking;
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async decideOnBooking({
    bookingId,
    status,
    currentUserId,
  }: {
    bookingId: string;
    status: booking_status;
    currentUserId: string;
  }) {
    try {
      const booking = await this.databaseService.getBooking({ bookingId });

      if (!booking)
        throw new NotFoundException(`Booking ${[bookingId]} not found!`);

      if (booking?.artistId !== currentUserId) {
        throw new ForbiddenException("You can't perform this action");
      }

      const updatedBooking = await this.databaseService.updateBooking({
        bookingId,
        booking: {
          status,
        },
      });

      return updatedBooking;
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async getMyBookings({
    userRole,
    organizerOrArtisteId,
  }: {
    userRole: user_role;
    organizerOrArtisteId: string;
  }) {
    try {
      if (userRole === user_role.artist) {
        return this.databaseService.getArtistBookings({
          artistId: organizerOrArtisteId,
        });
      }

      if (userRole === user_role.event_organizer) {
        return this.databaseService.getOrganiserBookings({
          organizerId: organizerOrArtisteId,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }
}

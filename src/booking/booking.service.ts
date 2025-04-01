import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { errorMessage } from 'src/common/utils';
import { booking_status, user_role } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private databaseService: DatabaseService) { }

  async createBooking({
    artistId,
    eventId,
  }: {
    artistId: string;
    eventId: string;
  }) {
    try {
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

  async deleteBooking({ bookingId }: { bookingId: string }) {
    try {
      const booking = this.databaseService.getBooking({ bookingId });

      if (!booking)
        throw new NotFoundException(`Booking ${[bookingId]} not found!`);

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
  }: {
    bookingId: string;
    status: booking_status;
  }) {
    try {
      const booking = this.databaseService.getBooking({ bookingId });

      if (!booking)
        throw new NotFoundException(`Booking ${[bookingId]} not found!`);

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
          organizerId: organizerOrArtisteId
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }
}

import { Injectable } from '@nestjs/common';
import { User, Event, Booking } from '@prisma/client';
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

  async createEvent({ event }: { event: Event }) {
    const newEvent = await this.prisma.event.create({
      data: {
        ...event,
      },
    });

    return newEvent;
  }

  async updateEvent({ event, eventId }: { event: Event; eventId: string }) {
    const updatedEvent = await this.prisma.event.update({
      where: {
        eventId,
      },
      data: {
        ...event,
      },
    });

    return updatedEvent;
  }

  async getEvent({ eventId }: { eventId: string }) {
    const event = await this.prisma.event.findFirst({
      where: {
        eventId,
      },
    });
    return event;
  }

  async deleteEvent({ eventId }: { eventId: string }) {
    const event = await this.prisma.event.findFirst({
      where: {
        eventId,
      },
    });
    return event;
  }

  async getEvents() {
    const events = await this.prisma.event.findMany();
    return events;
  }

  async getOrganiserEvents({ organizerId }: { organizerId: string }) {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
    });
    return events;
  }

  async getArtistEvents({ artistId }: { artistId: string }) {
    const events = await this.prisma.event.findMany({
      where: {
        bookings: {
          some: {
            artistId,
          },
        },
      },
    });
    return events;
  }

  async createBooking({
    eventId,
    artistId,
  }: {
    artistId: string;
    eventId: string;
  }) {
    const booking = await this.prisma.booking.create({
      data: {
        eventId,
        artistId,
      },
    });

    return booking;
  }

  async getBooking({ bookingId }: { bookingId: string }) {
    const booking = await this.prisma.booking.findFirst({
      where: { bookingId },
    });
    return booking;
  }

  async deleteBooking({ bookingId }: { bookingId: string }) {
    await this.prisma.booking.delete({ where: { bookingId } });
    return { bookingId };
  }

  async updateBooking({
    bookingId,
    booking,
  }: {
    bookingId: string;
    booking: Partial<Booking>;
  }) {
    const updatedBooking = await this.prisma.booking.update({
      where: {
        bookingId,
      },
      data: {
        ...booking,
      },
    });

    return updatedBooking;
  }

  async getArtistBookings({ artistId }: { artistId: string }) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        artistId,
      },
    });

    return bookings;
  }

  async getOrganiserBookings({ organizerId }: { organizerId: string }) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        event: {
          organizerId,
        },
      },
    });

    return bookings;
  }

  async getUserByOtl({ otl }: { otl: string }) {
    const userWithOtl = await this.prisma.user.findFirst({
      where: {
        otl
      }
    })

    return userWithOtl;
  }
}

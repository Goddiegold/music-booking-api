import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Event, user_role } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { errorMessage } from 'src/shared/utils';

@Injectable()
export class EventService {
  constructor(private databaseService: DatabaseService) { }

  async createEvent({ event }: { event: Event }) {
    try {
      return this.databaseService.createEvent({ event });
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async getEvent({ eventId }: { eventId: string }) {
    try {
      const event = await this.databaseService.getEvent({ eventId });

      if (!event) {
        throw new NotFoundException(`Event ${[eventId]} not found!`);
      }
      return event;
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async updateEvent({ event, eventId }: { eventId: string; event: Event }) {
    try {
      const eventExist = await this.databaseService.getEvent({ eventId });

      if (!eventExist) {
        throw new NotFoundException(`Event ${[eventId]} not found!`);
      }

      const updatedEvent = await this.databaseService.updateEvent({
        event,
        eventId,
      });
      return updatedEvent;
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async getEvents() {
    try {
      return this.databaseService.getEvents();
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async getMyEvents({
    organizerOrArtistId,
    userRole,
  }: {
    organizerOrArtistId: string;
    userRole: user_role;
  }) {
    try {
      if (userRole === user_role.artist) {
        return this.databaseService.getArtistEvents({
          artistId: organizerOrArtistId,
        });
      }

      if (userRole === user_role.event_organizer) {
        return this.databaseService.getOrganiserEvents({
          organizerId: organizerOrArtistId,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }

  async deleteEvent({ eventId }: { eventId: string }) {
    try {
      const event = await this.databaseService.getEvent({ eventId });

      if (!event) {
        throw new NotFoundException(`Event ${[eventId]} not found!`);
      }

      const deletedEvent = await this.databaseService.deleteEvent({ eventId })

      return deletedEvent;
    } catch (error) {
      throw new InternalServerErrorException(errorMessage(error));
    }
  }
}

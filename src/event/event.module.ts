import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [
  ],
  providers: [EventService, PrismaService, DatabaseService],
  controllers: [UserController],
})
export class EventModule { }

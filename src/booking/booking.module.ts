import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PrismaService } from 'src/prisma.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [],
  providers: [BookingService, PrismaService, DatabaseService],
  controllers: [BookingController],
})
export class BookingModule { }

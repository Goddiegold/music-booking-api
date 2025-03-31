import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    BookingModule, 
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

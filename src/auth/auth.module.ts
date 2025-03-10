import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { GoogleStrategy } from 'src/strategies/google.strategy.service';
import { JwtModule } from '@nestjs/jwt';
import { Config } from 'src/config';
import { JwtStrategy } from 'src/strategies/jwt.strategy.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [
    JwtModule.register({
      secret: Config.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    PrismaService,
    GoogleStrategy,
    JwtStrategy,
    DatabaseService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

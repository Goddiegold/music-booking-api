import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Config } from 'src/config';
import { DatabaseService } from 'src/database/database.service';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
    JwtStrategy,
    DatabaseService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

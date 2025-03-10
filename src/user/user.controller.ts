import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ResponseBody } from 'src/types';
import { UserService } from './user.service';
import { UpdatePasswordDTO } from 'src/dto/user.dto';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) { }

  @Post('/create')
  async createUser(
    @Body() body: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseBody<User>> {
    const result = await this.userService.createUser({ user: body });
    if (result) {
      const token = this.jwtService.sign({ userId: result.userId });
      res.setHeader('Authorization', token);
      return { result };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUserProfile(@Req() req): Promise<ResponseBody<User>> {
    const user = req?.user;
    const result = await this.userService.getUser({
      userEmailOrId: user?.email,
    });
    if (result) return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateProfile(
    @Req() req,
    @Body() body: UpdateUserDTO,
  ): Promise<ResponseBody<User>> {
    const user = req?.user as User;
    const result = await this.userService.updateUser({
      payload: { phone: body.phone },
      userId: user?.userId,
    });
    if (result) return { result };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-password')
  async updatePassword(
    @Req() req,
    @Body() body: UpdatePasswordDTO,
  ): Promise<ResponseBody<null>> {
    const user = req?.user as User;
    const result = await this.userService.updateUserPassword({
      userId: user.userId,
      ...body
    })
    if (result) return { ...result };
  }
}

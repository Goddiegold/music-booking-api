import { Body, Controller, Param, Patch, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { LoginInputDTO, ResetPaswordStep1DTO, ResetPaswordStep2DTO } from 'src/dto';
import { ResponseBody } from 'src/types';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) { }

  @Post('/login')
  async loginUserLocal(
    @Body() body: LoginInputDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseBody<User>> {
    const result = await this.authService.loginUserLocal({ user: body });
    if (result) {
      const token = this.jwtService.sign({
        userId: result?.userId
      })
      res.setHeader('Authorization', token);
      return { result };
    }
  }


  @Post('/reset-password')
  async resetPasswordStep1(
    @Body() body: ResetPaswordStep1DTO,
  ): Promise<ResponseBody<null>> {
    const result = await this.authService.requestToResetPassword({
      email: body.email,
    });
    if (result) return { ...result, result: null };
  }

  @Patch('/reset-password/:otl')
  async resetPasswordStep2(
    @Body() body: ResetPaswordStep2DTO,
    @Param('otl') otl: string,
  ): Promise<ResponseBody<null>> {
    const result = await this.authService.completeResetPassword({
      otl,
      newPassword: body.newPassword,
    });
    if (result) return { ...result, result: null };
  }
}

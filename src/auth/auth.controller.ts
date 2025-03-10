import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { Config } from 'src/config';
import { ResetPaswordStep1, ResetPaswordStep2 } from 'src/dto';
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
    @Body() body,
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

  // @UseGuards(GoogleAuthGuard)
  @Get('/google')
  async loginGoogleUser(@Query() qs: any, @Res() res): Promise<void> {
    try {
      console.log({ qs });
    } catch (e) {
      // throw new HttpException(e.message, 401);
      return res.redirect(`${Config.WEB_CLIENT}/login?error=${e.message}`);
    }
  }
  // @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  async googleAuthCallback(@Req() req, @Res() res) {
    try {
      const userData: User = req.user;
      // console.log("userData", userData);

      const frontendRedirectUrl = await this.authService.createUserWithSSO({
        provider: 'google',
        userData,
      });

      // console.log('redirectUrl', frontendRedirectUrl);
      return res.redirect(frontendRedirectUrl);
    } catch (e) {
      // throw new HttpException(e.message, 401);
      return res.redirect(`${Config.WEB_CLIENT}/login?error=${e.message}`);
    }
  }

  // @UseGuards(GoogleAuthGuard)
  @Get('/google')
  async loginXTwitterUser(@Query() qs: any, @Res() res): Promise<void> {
    try {
      console.log({ qs });
    } catch (e) {
      // throw new HttpException(e.message, 401);
      return res.redirect(`${Config.WEB_CLIENT}/login?error=${e.message}`);
    }
  }
  // @UseGuards(GoogleAuthGuard)
  @Get('/google/callback')
  async xTwitterAuthCallback(@Req() req, @Res() res) {
    try {
      const userData: User = req.user;
      // console.log("userData", userData);

      const frontendRedirectUrl = await this.authService.createUserWithSSO({
        provider: 'twitter',
        userData,
      });

      return res.redirect(frontendRedirectUrl);
    } catch (e) {
      return res.redirect(`${Config.WEB_CLIENT}/login?error=${e.message}`);
    }
  }

  @Post('/reset-password')
  async resetPasswordStep1(
    @Body() body: ResetPaswordStep1,
  ): Promise<ResponseBody<null>> {
    const result = await this.authService.requestToResetPassword({
      email: body.email,
    });
    if (result) return { ...result, result: null };
  }

  @Post('/reset-password/:otl')
  async resetPasswordStep2(
    @Body() body: ResetPaswordStep2,
    @Param('otl') otl: string,
  ): Promise<ResponseBody<null>> {
    const result = await this.authService.completeResetPassword({
      otl,
      newPassword: body.newPassword,
    });
    if (result) return { ...result, result: null };
  }
}

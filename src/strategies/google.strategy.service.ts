import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Config } from '../config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: Config.GOOGLE.CLIENT_ID,
      clientSecret: Config.GOOGLE.CLIENT_SECRET,
      callbackURL: Config.GOOGLE.CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = {
      provider: 'google',
      providerId: profile.id,
      email: profile.emails[0].value,
      firstName: `${profile.name.givenName}`,
      lastName: `${profile.name.familyName}`,
      avatar: profile.photos[0].value,
    };
    done(null, user);
    return user;
  }
}

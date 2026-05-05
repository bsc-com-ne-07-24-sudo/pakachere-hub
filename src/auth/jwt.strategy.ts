import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'PAKACHERE_SECRET_KEY_2026', // Must match your AuthModule key!
    });
  }

  async validate(payload: any) {
    // This attaches the user data (ID and Role) to the Request object
    return { userId: payload.sub, email: payload.username, role: payload.role };
  }
}
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
  ) {}

  register() {
    return {
      message: 'Register success',
    };
  }

  login() {

    const payload = {
      id: 1,
      email: 'admin@gmail.com',
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthCaregiver {
  id: string;
  email: string;
  role: string;
}

export const CurrentCaregiver = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthCaregiver => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

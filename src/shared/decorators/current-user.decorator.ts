import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '@contracts/auth';

export const CurrentUser = createParamDecorator(
  (name: string, ctx: ExecutionContext): UserDto | null => {
    const req = ctx.switchToHttp().getRequest();

    return req?.user ?? null;
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Auth0UserDto } from '@contracts/auth';

export const CurrentUser = createParamDecorator(
  (name: string, ctx: ExecutionContext): Auth0UserDto | null => {
    const req = ctx.switchToHttp().getRequest();

    return req?.user ?? null;
  },
);

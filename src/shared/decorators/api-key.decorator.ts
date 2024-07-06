import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiKeyDto } from '@contracts/project';

export const ApiKey = createParamDecorator(
  (name: string, ctx: ExecutionContext): ApiKeyDto | undefined => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.user) {
      return null;
    }

    return req.user;
  },
);

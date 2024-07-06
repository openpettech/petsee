import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from '@contracts/common';

export const Ctx = createParamDecorator(
  (name: string, ctx: ExecutionContext): Context => {
    const req = ctx.switchToHttp().getRequest();

    return {
      projectId: req?.user?.projectId,
    };
  },
);

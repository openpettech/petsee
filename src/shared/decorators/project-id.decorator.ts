import { IncomingMessage } from 'http';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProjectId = createParamDecorator(
  (name: string, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest<IncomingMessage>();
    const { headers } = req;

    const value = headers['x-project-id'] as string;

    return value;
  },
);

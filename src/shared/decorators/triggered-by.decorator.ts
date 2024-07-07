import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiKeyDto } from '@contracts/project';
import { ServiceRole } from '@contracts/common';

export const TriggeredBy = createParamDecorator(
  (name: string, ctx: ExecutionContext): ServiceRole => {
    const req = ctx.switchToHttp().getRequest();

    if (req.user instanceof ApiKeyDto) {
      return {
        apiKey: req.user.id,
      };
    }

    return {
      user: req.user.id,
    };
  },
);

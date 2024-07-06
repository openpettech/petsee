// import { Reflector } from '@nestjs/core';
// import { AuthGuard, IAuthGuard } from '@nestjs/passport';
// import { ExecutionContext, Injectable } from '@nestjs/common';

// @Injectable()
// export class JwtGuard extends AuthGuard('jwt') {
//   public constructor(private readonly reflector: Reflector) {
//     super();
//   }

//   public canActivate(
//     context: ExecutionContext,
//   ): ReturnType<IAuthGuard['canActivate']> {
//     return super.canActivate(context);
//   }

// handleRequest(
//   ...args: Parameters<
//     InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']
//   >
// ) {
//   console.log(args);
//   return super.handleRequest(...args);
// }
// }

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add custom logic before authentication
    return super.canActivate(context);
  }

  handleRequest(
    ...args: Parameters<
      InstanceType<ReturnType<typeof AuthGuard>>['handleRequest']
    >
  ) {
    console.log(args);
    return super.handleRequest(...args);
  }
}

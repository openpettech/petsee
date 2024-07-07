import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ProjectModule, ApiKeyService } from '@modules/project';

import { ApiKeyStrategy, JwtStrategy } from './strategies';

@Module({
  imports: [PassportModule, ProjectModule],
  providers: [ApiKeyService, ApiKeyStrategy, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}

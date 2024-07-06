import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ProjectModule, ApiKeyService } from '@modules/project';

import { ApiKeyStrategy, JwtStrategy } from './strategies';
import { CustomJwtAuthGuard } from './guards';

@Module({
  imports: [PassportModule, ProjectModule],
  providers: [ApiKeyService, ApiKeyStrategy, JwtStrategy, CustomJwtAuthGuard],
  exports: [PassportModule, CustomJwtAuthGuard],
})
export class AuthModule {}

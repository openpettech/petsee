import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';

import { Context } from '@contracts/common';
import { ApiKeyService } from '@modules/project';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(ApiKeyStrategy.name);

  constructor(private apiKeyService: ApiKeyService) {
    super();
  }

  async validate(token?: string): Promise<any> {
    if (!token) {
      throw new UnauthorizedException();
    }

    const apiKey = await this.apiKeyService.findOneBySecretKey(
      {} as Context,
      token,
    );
    if (!apiKey) {
      throw new UnauthorizedException();
    }

    return apiKey;
  }
}

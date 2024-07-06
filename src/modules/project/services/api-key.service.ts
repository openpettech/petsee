import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, ApiKey } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { generate } from 'generate-password';
import * as crypto from 'crypto';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateApiKeyDto,
  UpdateApiKeyDto,
  DeleteApiKeyDto,
  ApiKeyCreatedEvent,
  ApiKeyUpdatedEvent,
  ApiKeyDeletedEvent,
  ProjectEvents,
  ApiKeyDto,
  ProjectEntities,
} from '@contracts/project';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  static generateCacheId(projectId: string, id: string) {
    return `Project-${projectId}/ApiKey-${id}/ID`;
  }

  static generateCacheSecret(secretKey: string) {
    return `ApiKey-${secretKey}/SecretKey`;
  }

  static generateEntityId(entry: ApiKey) {
    return `Project-${entry.projectId}/ApiKey-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<ApiKeyDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<ApiKeyDto>,
  ) {}

  async findOneById(
    context: Context,
    projectId: string,
    id: string,
  ): Promise<ApiKeyDto | null> {
    const cachedData = await this.cacheService.get(
      ApiKeyService.generateCacheId(projectId, id),
    );
    if (cachedData) {
      return plainToInstance(ApiKeyDto, cachedData, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    }

    const entry = await this.prisma.apiKey.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(ApiKeyDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        ApiKeyService.generateCacheId(projectId, id),
        dto,
      );
    }

    return dto;
  }

  async findOneBySecretKey(
    context: Context,
    secretKey: string,
  ): Promise<ApiKeyDto | null> {
    const cachedData = await this.cacheService.get(
      ApiKeyService.generateCacheSecret(secretKey),
    );
    if (cachedData) {
      return plainToInstance(ApiKeyDto, cachedData, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      });
    }

    const hashedSecretKey = this.hashApiKey(secretKey);

    const entry = await this.prisma.apiKey.findFirst({
      where: {
        secretKey: hashedSecretKey,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(ApiKeyDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        ApiKeyService.generateCacheSecret(secretKey),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ApiKeyWhereInput = {},
  ): Promise<PageDto<ApiKeyDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.apiKey.findMany({
        take: pageOptionsDto.limit,
        skip: pageOptionsDto.offset,
        orderBy: {
          createdAt: pageOptionsDto.order,
        },
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
      this.prisma.apiKey.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ApiKeyDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }

  async create(context: Context, input: CreateApiKeyDto): Promise<ApiKeyDto> {
    const secretKey = generate({
      length: 100,
      uppercase: false,
      lowercase: true,
      numbers: true,
      symbols: false,
    });
    const last4 = secretKey.slice(-4);
    const hashedSecretKey = this.hashApiKey(secretKey);

    const entry = await this.prisma.apiKey.create({
      data: {
        ...input,
        secretKey: hashedSecretKey,
        last4,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      ApiKeyDto,
      {
        ...entry,
        secretKey,
      },
      {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
        groups: ['create'],
      },
    );

    await this.cacheService.set(
      ApiKeyService.generateCacheId(entry.projectId, entry.id),
      dto,
    );

    this.eventsService.emitEvent({
      projectId: input.projectId,
      entity: ProjectEntities.API_KEY,
      entityId: ApiKeyService.generateEntityId(entry),
      eventName: ProjectEvents.API_KEY_CREATED,
      event: new ApiKeyCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    console.log('dto service', dto);

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateApiKeyDto,
  ): Promise<ApiKeyDto> {
    const entry = await this.findOneById(context, projectId, id);
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.apiKey.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        ...data,
      },
    });
    const dto = plainToInstance(ApiKeyDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.set(
      ApiKeyService.generateCacheId(projectId, id),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: ProjectEntities.API_KEY,
      entityId: ApiKeyService.generateEntityId(updatedEntry),
      eventName: ProjectEvents.API_KEY_UPDATED,
      event: new ApiKeyUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteApiKeyDto): Promise<ApiKeyDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, projectId, id);
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.apiKey.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        deletedBy: deletedBy as Prisma.InputJsonValue,
        deletedAt: new Date(),
      },
    });
    const dto = plainToInstance(ApiKeyDto, updatedEntry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    await this.cacheService.del(ApiKeyService.generateCacheId(projectId, id));

    this.eventsService.emitEvent({
      projectId,
      entity: ProjectEntities.API_KEY,
      entityId: ApiKeyService.generateEntityId(updatedEntry),
      eventName: ProjectEvents.API_KEY_DELETED,
      event: new ApiKeyDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  private hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }
}

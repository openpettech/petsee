import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { ReferenceValueDto } from '@contracts/dictionary';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { CacheService, PrismaService } from '@modules/core';

@Injectable()
export class ReferenceValueService {
  private readonly logger = new Logger(ReferenceValueService.name);

  static generateCacheLocale(id: string) {
    return `ReferenceValue-${id}/ID`;
  }

  constructor(
    private readonly cacheService: CacheService<ReferenceValueDto>,
    private readonly prisma: PrismaService,
  ) {}

  async findOneById(
    context: Context,
    id: string,
  ): Promise<ReferenceValueDto | null> {
    const cachedData = await this.cacheService.get(
      ReferenceValueService.generateCacheLocale(id),
    );
    if (cachedData) {
      return cachedData;
    }

    const entry = await this.prisma.referenceValue.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(ReferenceValueDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        ReferenceValueService.generateCacheLocale(id),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ReferenceValueWhereInput = {},
  ): Promise<PageDto<ReferenceValueDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.referenceValue.findMany({
        take: pageOptionsDto.limit,
        skip: pageOptionsDto.offset,
        orderBy: {
          createdAt: pageOptionsDto.order,
        },
        where: {
          ...filters,
          deletedAt: null,
        },
        include: {
          translations: true,
        },
      }),
      this.prisma.referenceValue.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ReferenceValueDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }
}

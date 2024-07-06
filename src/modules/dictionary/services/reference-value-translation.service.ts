import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { ReferenceValueTranslationDto } from '@contracts/dictionary';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { CacheService, PrismaService } from '@modules/core';

@Injectable()
export class ReferenceValueTranslationService {
  private readonly logger = new Logger(ReferenceValueTranslationService.name);

  static generateCacheLocale(id: string, locale: string) {
    return `ReferenceValue-${id}/ReferenceValueTranslation-${locale}/Locale`;
  }

  constructor(
    private readonly cacheService: CacheService<ReferenceValueTranslationDto>,
    private readonly prisma: PrismaService,
  ) {}

  async findOneById(
    context: Context,
    id: string,
    locale: string,
  ): Promise<ReferenceValueTranslationDto | null> {
    const cachedData = await this.cacheService.get(
      ReferenceValueTranslationService.generateCacheLocale(id, locale),
    );
    if (cachedData) {
      return cachedData;
    }

    const entry = await this.prisma.referenceValueTranslation.findUnique({
      where: {
        referenceValueId_locale: {
          locale,
          referenceValueId: id,
        },
        deletedAt: null,
      },
    });
    const dto = plainToInstance(ReferenceValueTranslationDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        ReferenceValueTranslationService.generateCacheLocale(id, locale),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ReferenceValueTranslationWhereInput = {},
  ): Promise<PageDto<ReferenceValueTranslationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.referenceValueTranslation.findMany({
        take: pageOptionsDto.limit,
        skip: pageOptionsDto.offset,
        orderBy: {
          name: pageOptionsDto.order,
        },
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
      this.prisma.referenceValueTranslation.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ReferenceValueTranslationDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }
}

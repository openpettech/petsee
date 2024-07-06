import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { AllergenTranslationDto } from '@contracts/dictionary';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { CacheService, PrismaService } from '@modules/core';

@Injectable()
export class AllergenTranslationService {
  private readonly logger = new Logger(AllergenTranslationService.name);

  static generateCacheLocale(id: string, locale: string) {
    return `Allergen-${id}/AllergenTranslation-${locale}/Locale`;
  }

  constructor(
    private readonly cacheService: CacheService<AllergenTranslationDto>,
    private readonly prisma: PrismaService,
  ) {}

  async findOneById(
    context: Context,
    id: string,
    locale: string,
  ): Promise<AllergenTranslationDto | null> {
    const cachedData = await this.cacheService.get(
      AllergenTranslationService.generateCacheLocale(id, locale),
    );
    if (cachedData) {
      return cachedData;
    }

    const entry = await this.prisma.allergenTranslation.findUnique({
      where: {
        allergenId_locale: {
          locale,
          allergenId: id,
        },
        deletedAt: null,
      },
    });
    const dto = plainToInstance(AllergenTranslationDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        AllergenTranslationService.generateCacheLocale(id, locale),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.AllergenTranslationWhereInput = {},
  ): Promise<PageDto<AllergenTranslationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.allergenTranslation.findMany({
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
      this.prisma.allergenTranslation.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(AllergenTranslationDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }
}

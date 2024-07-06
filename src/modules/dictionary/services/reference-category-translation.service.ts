import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { ReferenceCategoryTranslationDto } from '@contracts/dictionary';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { CacheService, PrismaService } from '@modules/core';

@Injectable()
export class ReferenceCategoryTranslationService {
  private readonly logger = new Logger(
    ReferenceCategoryTranslationService.name,
  );

  static generateCacheLocale(id: string, locale: string) {
    return `ReferenceCategory-${id}/ReferenceCategoryTranslation-${locale}/Locale`;
  }

  constructor(
    private readonly cacheService: CacheService<ReferenceCategoryTranslationDto>,
    private readonly prisma: PrismaService,
  ) {}

  async findOneById(
    context: Context,
    id: string,
    locale: string,
  ): Promise<ReferenceCategoryTranslationDto | null> {
    const cachedData = await this.cacheService.get(
      ReferenceCategoryTranslationService.generateCacheLocale(id, locale),
    );
    if (cachedData) {
      return cachedData;
    }

    const entry = await this.prisma.referenceCategoryTranslation.findUnique({
      where: {
        referenceCategoryId_locale: {
          locale,
          referenceCategoryId: id,
        },
        deletedAt: null,
      },
    });
    const dto = plainToInstance(ReferenceCategoryTranslationDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        ReferenceCategoryTranslationService.generateCacheLocale(id, locale),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.ReferenceCategoryTranslationWhereInput = {},
  ): Promise<PageDto<ReferenceCategoryTranslationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.referenceCategoryTranslation.findMany({
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
      this.prisma.referenceCategoryTranslation.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(ReferenceCategoryTranslationDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }
}

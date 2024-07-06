import { plainToInstance } from 'class-transformer';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BreedTranslationDto } from '@contracts/dictionary';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { CacheService, PrismaService } from '@modules/core';

@Injectable()
export class BreedTranslationService {
  private readonly logger = new Logger(BreedTranslationService.name);

  static generateCacheLocale(breedId: string, locale: string) {
    return `Breed-${breedId}/BreedTranslation-${locale}/Locale`;
  }

  constructor(
    private readonly cacheService: CacheService<BreedTranslationDto>,
    private readonly prisma: PrismaService,
  ) {}

  async findOneByLocale(
    context: Context,
    breedId: string,
    locale: string,
  ): Promise<BreedTranslationDto | null> {
    const cachedData = await this.cacheService.get(
      BreedTranslationService.generateCacheLocale(breedId, locale),
    );
    if (cachedData) {
      return cachedData;
    }

    const entry = await this.prisma.breedTranslation.findUnique({
      where: {
        breedId_locale: {
          locale,
          breedId,
        },
        deletedAt: null,
      },
    });
    const dto = plainToInstance(BreedTranslationDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        BreedTranslationService.generateCacheLocale(breedId, locale),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.BreedTranslationWhereInput = {},
  ): Promise<PageDto<BreedTranslationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.breedTranslation.findMany({
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
      this.prisma.breedTranslation.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(BreedTranslationDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }
}

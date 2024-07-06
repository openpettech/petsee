import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { BloodGroupTranslationDto } from '@contracts/dictionary';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { CacheService, PrismaService } from '@modules/core';

@Injectable()
export class BloodGroupTranslationService {
  private readonly logger = new Logger(BloodGroupTranslationService.name);

  static generateCacheLocale(id: string, locale: string) {
    return `BloodGroup-${id}/BloodGroupTranslation-${locale}/Locale`;
  }

  constructor(
    private readonly cacheService: CacheService<BloodGroupTranslationDto>,
    private readonly prisma: PrismaService,
  ) {}

  async findOneById(
    context: Context,
    id: string,
    locale: string,
  ): Promise<BloodGroupTranslationDto | null> {
    const cachedData = await this.cacheService.get(
      BloodGroupTranslationService.generateCacheLocale(id, locale),
    );
    if (cachedData) {
      return cachedData;
    }

    const entry = await this.prisma.bloodGroupTranslation.findUnique({
      where: {
        bloodGroupId_locale: {
          locale,
          bloodGroupId: id,
        },
        deletedAt: null,
      },
    });
    const dto = plainToInstance(BloodGroupTranslationDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        BloodGroupTranslationService.generateCacheLocale(id, locale),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.BloodGroupTranslationWhereInput = {},
  ): Promise<PageDto<BloodGroupTranslationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.bloodGroupTranslation.findMany({
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
      this.prisma.bloodGroupTranslation.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(BloodGroupTranslationDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }
}

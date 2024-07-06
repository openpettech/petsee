import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { DiagnoseTranslationDto } from '@contracts/dictionary';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { CacheService, PrismaService } from '@modules/core';

@Injectable()
export class DiagnoseTranslationService {
  private readonly logger = new Logger(DiagnoseTranslationService.name);

  static generateCacheLocale(id: string, locale: string) {
    return `Diagnose-${id}/DiagnoseTranslation-${locale}/Locale`;
  }

  constructor(
    private readonly cacheService: CacheService<DiagnoseTranslationDto>,
    private readonly prisma: PrismaService,
  ) {}

  async findOneById(
    context: Context,
    id: string,
    locale: string,
  ): Promise<DiagnoseTranslationDto | null> {
    const cachedData = await this.cacheService.get(
      DiagnoseTranslationService.generateCacheLocale(id, locale),
    );
    if (cachedData) {
      return cachedData;
    }

    const entry = await this.prisma.diagnoseTranslation.findUnique({
      where: {
        diagnoseId_locale: {
          locale,
          diagnoseId: id,
        },
        deletedAt: null,
      },
    });
    const dto = plainToInstance(DiagnoseTranslationDto, entry, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });

    if (!!dto) {
      await this.cacheService.set(
        DiagnoseTranslationService.generateCacheLocale(id, locale),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.DiagnoseTranslationWhereInput = {},
  ): Promise<PageDto<DiagnoseTranslationDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.diagnoseTranslation.findMany({
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
      this.prisma.diagnoseTranslation.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(DiagnoseTranslationDto, entry, {
          excludeExtraneousValues: true,
          exposeDefaultValues: true,
        }),
      ),
      pageMetaDto,
    );
  }
}

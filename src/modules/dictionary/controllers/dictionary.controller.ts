import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { I18n, I18nContext } from 'nestjs-i18n';

import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import {
  AllergenTranslationDto,
  BloodGroupTranslationDto,
  DiagnoseTranslationDto,
  ReferenceCategoryTranslationDto,
  ReferenceValueDto,
  SpeciesTranslationDto,
} from '@contracts/dictionary';
import { Ctx } from '@shared/decorators';

import {
  BreedTranslationService,
  SpeciesTranslationService,
  DiagnoseTranslationService,
  BloodGroupTranslationService,
  AllergenTranslationService,
  ReferenceCategoryTranslationService,
  ReferenceValueService,
} from '../services';

@ApiTags('Dictionary')
@Controller('dictionary')
@UseGuards(AuthGuard('bearer'))
export class DictionaryController {
  private readonly logger = new Logger(DictionaryController.name);

  constructor(
    private readonly allergenTranslationService: AllergenTranslationService,
    private readonly bloodGroupTranslationService: BloodGroupTranslationService,
    private readonly breedTranslationService: BreedTranslationService,
    private readonly diagnoseTranslationService: DiagnoseTranslationService,
    private readonly speciesTranslationService: SpeciesTranslationService,
    private readonly referenceCategoryTranslationService: ReferenceCategoryTranslationService,
    private readonly referenceValueService: ReferenceValueService,
  ) {}

  @Get('/references')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ReferenceCategoryTranslationDto)
  async references(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.referenceCategoryTranslationService.findAll(
      context,
      pageOptionsDto,
      {
        locale: this.getLocale(i18n.lang),
      },
    );
  }

  @Get('/references/:referenceCategoryId/values/:speciesId')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ReferenceValueDto)
  async referenceValues(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @Param('referenceCategoryId') referenceCategoryId: string,
    @Param('speciesId') speciesId: string,
  ) {
    return this.referenceValueService.findAll(context, pageOptionsDto, {
      referenceCategoryId,
      speciesId,
    });
  }

  @Get('/species')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(SpeciesTranslationDto)
  async species(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.speciesTranslationService.findAll(context, pageOptionsDto, {
      locale: this.getLocale(i18n.lang),
    });
  }

  @Get('/allergens')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(AllergenTranslationDto)
  async allergens(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.allergenTranslationService.findAll(context, pageOptionsDto, {
      locale: this.getLocale(i18n.lang),
    });
  }

  @Get('/diagnoses')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(DiagnoseTranslationDto)
  async diagnoses(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.diagnoseTranslationService.findAll(context, pageOptionsDto, {
      locale: this.getLocale(i18n.lang),
    });
  }

  @Get('/species/:speciesId/breeds')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(BreedTranslationService)
  async breeds(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @Param('speciesId') speciesId: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.breedTranslationService.findAll(context, pageOptionsDto, {
      locale: this.getLocale(i18n.lang),
      breed: {
        speciesId,
      },
    });
  }

  @Get('/species/:speciesId/blood-groups')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(BloodGroupTranslationDto)
  async bloodGroups(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @Param('speciesId') speciesId: string,
    @I18n() i18n: I18nContext,
  ) {
    return this.bloodGroupTranslationService.findAll(context, pageOptionsDto, {
      locale: this.getLocale(i18n.lang),
      bloodGroup: {
        speciesId,
      },
    });
  }

  private getLocale(lang?: string) {
    const isoCode = lang?.split('-')?.[0];
    if (
      ['en', 'de', 'es', 'pt', 'fr', 'it', 'pl', 'ja', 'ko', 'zh'].includes(
        isoCode,
      )
    ) {
      return isoCode;
    }

    throw new BadRequestException(
      `Language ${isoCode} is not supperted. Only following ones are ['en', 'de', 'es', 'pt', 'fr', 'it', 'pl', 'ja', 'ko', 'zh']`,
    );
  }
}

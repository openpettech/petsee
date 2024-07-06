import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Delete,
  Param,
  NotFoundException,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  FacilityDto,
  CreateFacilityRequest,
  UpdateFacilityRequest,
} from '@contracts/organization';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKeyDto } from '@contracts/project';
import { ApiKey, Ctx } from '@shared/decorators';

import { FacilityService, MerchantAssociationService } from '../services';

@ApiTags('Organization')
@Controller('facilities')
@UseGuards(AuthGuard('bearer'))
export class FacilityController {
  private readonly logger = new Logger(FacilityController.name);

  constructor(
    private readonly facilityService: FacilityService,
    private readonly merchantAssociationService: MerchantAssociationService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(FacilityDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.facilityService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: FacilityDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.facilityService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Facility not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: FacilityDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    { merchantId, ...createFacilityDto }: CreateFacilityRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    const commonProps = {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
    };
    const entry = await this.facilityService.create(context, {
      ...commonProps,
      ...createFacilityDto,
    });

    if (!!merchantId) {
      await this.merchantAssociationService.create(context, {
        ...commonProps,
        merchantId,
        facilityId: entry.id,
      });
    }

    return entry;
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: FacilityDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateFacilityDto: UpdateFacilityRequest,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.facilityService.update(context, {
      id,
      projectId: context.projectId,
      ...updateFacilityDto,
      updatedBy: {
        apiKey: apiKey.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: FacilityDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.facilityService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: {
        apiKey: apiKey.id,
      },
    });
  }
}

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
  MerchantDto,
  CreateMerchantRequest,
  UpdateMerchantRequest,
} from '@contracts/organization';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKeyDto } from '@contracts/project';
import { ApiKey, Ctx } from '@shared/decorators';

import { MerchantService, GroupAssociationService } from '../services';

@ApiTags('Organization')
@Controller('merchants')
@UseGuards(AuthGuard('bearer'))
export class MerchantController {
  private readonly logger = new Logger(MerchantController.name);

  constructor(
    private readonly merchantService: MerchantService,
    private readonly groupAssociationService: GroupAssociationService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(MerchantDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.merchantService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: MerchantDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.merchantService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Merchant not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: MerchantDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    { groupId, ...createMerchantDto }: CreateMerchantRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    const commonProps = {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
    };
    const entry = await this.merchantService.create(context, {
      ...commonProps,
      ...createMerchantDto,
    });

    if (!!groupId) {
      await this.groupAssociationService.create(context, {
        ...commonProps,
        groupId,
        merchantId: entry.id,
      });
    }

    return entry;
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: MerchantDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateMerchantDto: UpdateMerchantRequest,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.merchantService.update(context, {
      id,
      projectId: context.projectId,
      ...updateMerchantDto,
      updatedBy: {
        apiKey: apiKey.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: MerchantDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.merchantService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: {
        apiKey: apiKey.id,
      },
    });
  }
}

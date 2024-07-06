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
  MerchantAssociationDto,
  CreateMerchantAssociationRequest,
  UpdateMerchantAssociationRequest,
} from '@contracts/organization';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKeyDto } from '@contracts/project';
import { ApiKey, Ctx } from '@shared/decorators';

import { MerchantAssociationService } from '../services';

@ApiTags('Organization')
@Controller('merchant-associations')
@UseGuards(AuthGuard('bearer'))
export class MerchantAssociationController {
  private readonly logger = new Logger(MerchantAssociationController.name);

  constructor(
    private readonly merchantAssociationService: MerchantAssociationService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(MerchantAssociationDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.merchantAssociationService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: MerchantAssociationDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.merchantAssociationService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Merchant Association not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: MerchantAssociationDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createMerchantAssociationDto: CreateMerchantAssociationRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.merchantAssociationService.create(context, {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
      ...createMerchantAssociationDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: MerchantAssociationDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateMerchantAssociationDto: UpdateMerchantAssociationRequest,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.merchantAssociationService.update(context, {
      id,
      projectId: context.projectId,
      ...updateMerchantAssociationDto,
      updatedBy: {
        apiKey: apiKey.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: MerchantAssociationDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.merchantAssociationService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: {
        apiKey: apiKey.id,
      },
    });
  }
}

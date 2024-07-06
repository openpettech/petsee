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
  ServiceOverrideDto,
  CreateServiceOverrideRequest,
  UpdateServiceOverrideRequest,
} from '@contracts/service';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKeyDto } from '@contracts/project';
import { ApiKey, Ctx } from '@shared/decorators';

import { ServiceOverrideService } from '../services';

@ApiTags('Service')
@Controller('service-overrides')
@UseGuards(AuthGuard('bearer'))
export class ServiceOverrideController {
  private readonly logger = new Logger(ServiceOverrideController.name);

  constructor(
    private readonly serviceOverrideService: ServiceOverrideService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ServiceOverrideDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.serviceOverrideService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ServiceOverrideDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.serviceOverrideService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('ServiceOverride not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ServiceOverrideDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createServiceOverrideDto: CreateServiceOverrideRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.serviceOverrideService.create(context, {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
      ...createServiceOverrideDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: ServiceOverrideDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateServiceOverrideDto: UpdateServiceOverrideRequest,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.serviceOverrideService.update(context, {
      id,
      projectId: context.projectId,
      ...updateServiceOverrideDto,
      updatedBy: {
        apiKey: apiKey.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: ServiceOverrideDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.serviceOverrideService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: {
        apiKey: apiKey.id,
      },
    });
  }
}

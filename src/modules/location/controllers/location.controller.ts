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
  LocationDto,
  CreateLocationRequest,
  UpdateLocationRequest,
} from '@contracts/location';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { LocationService } from '../services';

@ApiTags('Location')
@Controller('locations')
@UseGuards(AuthGuard('bearer'))
export class LocationController {
  private readonly logger = new Logger(LocationController.name);

  constructor(private readonly locationService: LocationService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(LocationDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.locationService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LocationDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.locationService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Location not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: LocationDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createLocationDto: CreateLocationRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.locationService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createLocationDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: LocationDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateLocationDto: UpdateLocationRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.locationService.update(context, {
      id,
      projectId: context.projectId,
      ...updateLocationDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: LocationDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.locationService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}

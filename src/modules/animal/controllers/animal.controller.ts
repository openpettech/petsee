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
  Logger,
  UseGuards,
  NotImplementedException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnimalOwnershipType } from '@prisma/client';

import {
  AnimalDto,
  AnimalEntities,
  AnimalFiltersDto,
  CreateAnimalRequest,
  UpdateAnimalRequest,
} from '@contracts/animal';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { SearchRequestDto } from '@contracts/core';
import { Ctx, TriggeredBy } from '@shared/decorators';
import { SearchService } from '@modules/core';

import { AnimalService, AnimalRelationshipService } from '../services';

@ApiTags('Animal')
@Controller('animals')
@UseGuards(AuthGuard('bearer'))
export class AnimalController {
  private readonly logger = new Logger(AnimalController.name);

  constructor(
    private readonly animalService: AnimalService,
    private readonly animalRelationshipService: AnimalRelationshipService,
    private readonly searchService: SearchService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(AnimalDto)
  async list(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() filters: AnimalFiltersDto,
  ) {
    return this.animalService.findAll(context, pageOptionsDto, {
      ...filters,
      projectId: context.projectId,
    });
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(AnimalDto)
  async search(
    @Ctx() context: Context,
    @Query() searchRequestDto: SearchRequestDto,
  ) {
    if (!this.searchService) {
      return new NotImplementedException('Search module not set up');
    }

    return this.searchService.search({
      indexName: AnimalEntities.ANIMAL,
      projectId: context.projectId,
      ...searchRequestDto,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AnimalDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.animalService.findOneById(context, {
      projectId: context.projectId,
      id,
    });

    if (!entry) {
      throw new NotFoundException('Animal not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: AnimalDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createAnimalDto: CreateAnimalRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    const { customerId } = createAnimalDto;
    const createdBy = triggeredBy;

    const animal = await this.animalService.create(context, {
      projectId: context.projectId,
      createdBy,
      ...createAnimalDto,
    });

    if (!!customerId) {
      await this.animalRelationshipService.create(context, {
        createdBy,
        customerId,
        projectId: context.projectId,
        animalId: animal.id,
        type: AnimalOwnershipType.OWNER,
      });
    }

    return animal;
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: AnimalDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateAnimalDto: UpdateAnimalRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.animalService.update(context, {
      id,
      projectId: context.projectId,
      ...updateAnimalDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: AnimalDto,
  })
  async delete(
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
    @Param('id') id: string,
  ) {
    return this.animalService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}

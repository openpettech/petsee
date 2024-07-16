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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  AnimalDto,
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
import { Ctx, TriggeredBy } from '@shared/decorators';

import { AnimalService, AnimalRelationshipService } from '../services';
import { AnimalOwnershipType } from '@prisma/client';

@ApiTags('Animal')
@Controller('animals')
@UseGuards(AuthGuard('bearer'))
export class AnimalController {
  private readonly logger = new Logger(AnimalController.name);

  constructor(
    private readonly animalService: AnimalService,
    private readonly animalRelationshipService: AnimalRelationshipService,
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

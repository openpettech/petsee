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
  AnimalRelationshipDto,
  CreateAnimalRelationshipRequest,
  UpdateAnimalRelationshipRequest,
} from '@contracts/animal';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKeyDto } from '@contracts/project';
import { ApiKey, Ctx } from '@shared/decorators';

import { AnimalRelationshipService } from '../services';

@ApiTags('Animal')
@Controller('animal-relationships')
@UseGuards(AuthGuard('bearer'))
export class AnimalRelationshipController {
  private readonly logger = new Logger(AnimalRelationshipController.name);

  constructor(
    private readonly animalRelationshipService: AnimalRelationshipService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(AnimalRelationshipDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.animalRelationshipService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: AnimalRelationshipDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.animalRelationshipService.findOneById(context, {
      id,
      projectId: context.projectId,
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
    type: AnimalRelationshipDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createAnimalRelationshipDto: CreateAnimalRelationshipRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.animalRelationshipService.create(context, {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
      ...createAnimalRelationshipDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: AnimalRelationshipDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateAnimalRelationshipDto: UpdateAnimalRelationshipRequest,
    @ApiKey() apiKey: ApiKeyDto,
    @Param('id') id: string,
  ) {
    return this.animalRelationshipService.update(context, {
      id,
      projectId: context.projectId,
      ...updateAnimalRelationshipDto,
      updatedBy: {
        apiKey: apiKey.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: AnimalRelationshipDto,
  })
  async delete(
    @Ctx() context: Context,
    @ApiKey() apiKey: ApiKeyDto,
    @Param('id') id: string,
  ) {
    return this.animalRelationshipService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: {
        apiKey: apiKey.id,
      },
    });
  }
}

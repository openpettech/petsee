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
} from '@nestjs/common';
import { Logger } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import {
  ProjectDto,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '@contracts/project';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { ProjectService } from '../services';

@ApiTags('Project')
@Controller('projects')
@UseGuards(AuthGuard(['Auth0', 'bearer']))
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ProjectDto)
  async list(@Query() pageOptionsDto: PageOptionsDto, @Ctx() context: Context) {
    return this.projectService.findAll(context, pageOptionsDto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ProjectDto,
  })
  async get(@Param('id') id: string, @Ctx() context: Context) {
    const entry = await this.projectService.findOneById(context, id);
    if (!entry) {
      throw new NotFoundException('Project not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ProjectDto,
  })
  async create(
    @Body()
    createProjectDto: CreateProjectRequest,
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.projectService.create(context, {
      createdBy: triggeredBy,
      ...createProjectDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: ProjectDto,
  })
  async update(
    @Body() updateProjectDto: UpdateProjectRequest,
    @Param('id') id: string,
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.projectService.update(context, {
      id,
      ...updateProjectDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: ProjectDto,
  })
  async delete(
    @Param('id') id: string,
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.projectService.delete(context, {
      id,
      deletedBy: triggeredBy,
    });
  }
}

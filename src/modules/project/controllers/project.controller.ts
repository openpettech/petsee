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
} from '@contracts/common';
import {
  ProjectDto,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '@contracts/project';
import { Auth0UserDto } from '@contracts/auth';
import { CurrentUser, Ctx } from '@shared/decorators';

import { ProjectService } from '../services';

@ApiTags('Project')
@Controller('projects')
@UseGuards(AuthGuard('Auth0'))
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
    @CurrentUser() user: Auth0UserDto,
  ) {
    return this.projectService.create(context, {
      createdBy: {
        user: user.id,
      },
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
    @CurrentUser() user: Auth0UserDto,
  ) {
    return this.projectService.update(context, {
      id,
      ...updateProjectDto,
      updatedBy: {
        user: user.id,
      },
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
    @CurrentUser() user: Auth0UserDto,
  ) {
    return this.projectService.delete(context, {
      id,
      deletedBy: {
        user: user.id,
      },
    });
  }
}

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
  GroupDto,
  CreateGroupRequest,
  UpdateGroupRequest,
} from '@contracts/organization';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKeyDto } from '@contracts/project';
import { ApiKey, Ctx } from '@shared/decorators';

import { GroupService } from '../services';

@ApiTags('Organization')
@Controller('groups')
@UseGuards(AuthGuard('bearer'))
export class GroupController {
  private readonly logger = new Logger(GroupController.name);

  constructor(private readonly groupService: GroupService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(GroupDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.groupService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GroupDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.groupService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Group not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: GroupDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createGroupDto: CreateGroupRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.groupService.create(context, {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
      ...createGroupDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: GroupDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateGroupDto: UpdateGroupRequest,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.groupService.update(context, {
      id,
      projectId: context.projectId,
      ...updateGroupDto,
      updatedBy: {
        apiKey: apiKey.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: GroupDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.groupService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: {
        apiKey: apiKey.id,
      },
    });
  }
}

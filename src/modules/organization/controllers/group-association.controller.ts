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
  GroupAssociationDto,
  CreateGroupAssociationRequest,
  UpdateGroupAssociationRequest,
} from '@contracts/organization';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { GroupAssociationService } from '../services';

@ApiTags('Organization')
@Controller('group-associations')
@UseGuards(AuthGuard('bearer'))
export class GroupAssociationController {
  private readonly logger = new Logger(GroupAssociationController.name);

  constructor(
    private readonly groupAssociationService: GroupAssociationService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(GroupAssociationDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.groupAssociationService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GroupAssociationDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.groupAssociationService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Group Association not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: GroupAssociationDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createGroupAssociationDto: CreateGroupAssociationRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.groupAssociationService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createGroupAssociationDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: GroupAssociationDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateGroupAssociationDto: UpdateGroupAssociationRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.groupAssociationService.update(context, {
      id,
      projectId: context.projectId,
      ...updateGroupAssociationDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: GroupAssociationDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.groupAssociationService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}

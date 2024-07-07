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

import { TagDto, CreateTagRequest, UpdateTagRequest } from '@contracts/tag';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { TagService } from '../services';

@ApiTags('Tag')
@Controller('tags')
@UseGuards(AuthGuard('bearer'))
export class TagController {
  private readonly logger = new Logger(TagController.name);

  constructor(private readonly tagService: TagService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(TagDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.tagService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TagDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.tagService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Tag not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: TagDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createTagDto: CreateTagRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.tagService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createTagDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: TagDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateTagDto: UpdateTagRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.tagService.update(context, {
      id,
      projectId: context.projectId,
      ...updateTagDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: TagDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.tagService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}

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

import { NoteDto, CreateNoteRequest, UpdateNoteRequest } from '@contracts/note';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { NoteService } from '../services';

@ApiTags('Note')
@Controller('notes')
@UseGuards(AuthGuard('bearer'))
export class NoteController {
  private readonly logger = new Logger(NoteController.name);

  constructor(private readonly noteService: NoteService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(NoteDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.noteService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: NoteDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.noteService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Note not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: NoteDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createNoteDto: CreateNoteRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.noteService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createNoteDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: NoteDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateNoteDto: UpdateNoteRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.noteService.update(context, {
      id,
      projectId: context.projectId,
      ...updateNoteDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: NoteDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.noteService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}

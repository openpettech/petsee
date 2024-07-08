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
  DocumentTemplateFieldOptionDto,
  CreateDocumentTemplateFieldOptionRequest,
  UpdateDocumentTemplateFieldOptionRequest,
} from '@contracts/document';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { DocumentTemplateFieldOptionService } from '../services';

@ApiTags('Document')
@Controller('document-template-field-options')
@UseGuards(AuthGuard('bearer'))
export class DocumentTemplateFieldOptionController {
  private readonly logger = new Logger(
    DocumentTemplateFieldOptionController.name,
  );

  constructor(
    private readonly tagService: DocumentTemplateFieldOptionService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(DocumentTemplateFieldOptionDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.tagService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: DocumentTemplateFieldOptionDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.tagService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Document Template not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: DocumentTemplateFieldOptionDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createDocumentTemplateFieldOptionDto: CreateDocumentTemplateFieldOptionRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.tagService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createDocumentTemplateFieldOptionDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: DocumentTemplateFieldOptionDto,
  })
  async update(
    @Ctx() context: Context,
    @Body()
    updateDocumentTemplateFieldOptionDto: UpdateDocumentTemplateFieldOptionRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.tagService.update(context, {
      id,
      projectId: context.projectId,
      ...updateDocumentTemplateFieldOptionDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: DocumentTemplateFieldOptionDto,
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

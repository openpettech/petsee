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
  DocumentTemplateFieldDto,
  CreateDocumentTemplateFieldRequest,
  UpdateDocumentTemplateFieldRequest,
} from '@contracts/document';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { DocumentTemplateFieldService } from '../services';

@ApiTags('Document')
@Controller('document-template-fields')
@UseGuards(AuthGuard('bearer'))
export class DocumentTemplateFieldController {
  private readonly logger = new Logger(DocumentTemplateFieldController.name);

  constructor(private readonly tagService: DocumentTemplateFieldService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(DocumentTemplateFieldDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.tagService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: DocumentTemplateFieldDto,
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
    type: DocumentTemplateFieldDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createDocumentTemplateFieldDto: CreateDocumentTemplateFieldRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.tagService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createDocumentTemplateFieldDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: DocumentTemplateFieldDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateDocumentTemplateFieldDto: UpdateDocumentTemplateFieldRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.tagService.update(context, {
      id,
      projectId: context.projectId,
      ...updateDocumentTemplateFieldDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: DocumentTemplateFieldDto,
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

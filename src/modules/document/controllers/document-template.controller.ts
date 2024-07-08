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
  DocumentTemplateDto,
  CreateDocumentTemplateRequest,
  UpdateDocumentTemplateRequest,
} from '@contracts/document';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { DocumentTemplateService } from '../services';

@ApiTags('Document')
@Controller('document-templates')
@UseGuards(AuthGuard('bearer'))
export class DocumentTemplateController {
  private readonly logger = new Logger(DocumentTemplateController.name);

  constructor(private readonly tagService: DocumentTemplateService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(DocumentTemplateDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.tagService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: DocumentTemplateDto,
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
    type: DocumentTemplateDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createDocumentTemplateDto: CreateDocumentTemplateRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.tagService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createDocumentTemplateDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: DocumentTemplateDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateDocumentTemplateDto: UpdateDocumentTemplateRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.tagService.update(context, {
      id,
      projectId: context.projectId,
      ...updateDocumentTemplateDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: DocumentTemplateDto,
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

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, DocumentTemplateFieldOption } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateDocumentTemplateFieldOptionDto,
  UpdateDocumentTemplateFieldOptionDto,
  DeleteDocumentTemplateFieldOptionDto,
  DocumentTemplateFieldOptionCreatedEvent,
  DocumentTemplateFieldOptionUpdatedEvent,
  DocumentTemplateFieldOptionDeletedEvent,
  DocumentTemplateFieldOptionDto,
  DocumentEvents,
  DocumentEntities,
} from '@contracts/document';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';
import { DEFAULT_CLASS_TRANFORM_OPTIONS } from '@constants/class-transformer.constant';
import { createConnectObject } from '@utils/prisma';

type GenerateCacheIdParams = {
  projectId: string;
  id: string;
};

type FindOneByIdParams = {
  projectId: string;
  id: string;
};

@Injectable()
export class DocumentTemplateFieldOptionService {
  private readonly logger = new Logger(DocumentTemplateFieldOptionService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/DocumentTemplateFieldOption-${id}/ID`;
  }

  static generateEntityId(entry: DocumentTemplateFieldOption) {
    return `Project-${entry.projectId}/DocumentTemplateFieldOption-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<DocumentTemplateFieldOptionDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<DocumentTemplateFieldOptionDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<DocumentTemplateFieldOptionDto | null> {
    const cachedData = await this.cacheService.get(
      DocumentTemplateFieldOptionService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        DocumentTemplateFieldOptionDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.documentTemplateFieldOption.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      DocumentTemplateFieldOptionDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        DocumentTemplateFieldOptionService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.DocumentTemplateFieldOptionWhereInput = {},
  ): Promise<PageDto<DocumentTemplateFieldOptionDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.documentTemplateFieldOption.findMany({
        take: pageOptionsDto.limit,
        skip: pageOptionsDto.offset,
        orderBy: {
          createdAt: pageOptionsDto.order,
        },
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
      this.prisma.documentTemplateFieldOption.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(
          DocumentTemplateFieldOptionDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    {
      projectId,
      documentTemplateFieldId,
      documentTemplateId,
      ...input
    }: CreateDocumentTemplateFieldOptionDto,
  ): Promise<DocumentTemplateFieldOptionDto> {
    const entry = await this.prisma.documentTemplateFieldOption.create({
      data: {
        ...input,
        project: createConnectObject(projectId),
        template: createConnectObject(documentTemplateId),
        field: createConnectObject(documentTemplateFieldId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      DocumentTemplateFieldOptionDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      DocumentTemplateFieldOptionService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_TEMPLATE_FIELD_OPTION,
      entityId: DocumentTemplateFieldOptionService.generateEntityId(entry),
      eventName: DocumentEvents.DOCUMENT_TEMPLATE_FIELD_OPTION_CREATED,
      event: new DocumentTemplateFieldOptionCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateDocumentTemplateFieldOptionDto,
  ): Promise<DocumentTemplateFieldOptionDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.documentTemplateFieldOption.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        updatedBy: updatedBy as Prisma.InputJsonValue,
        ...data,
      },
    });
    const dto = plainToInstance(
      DocumentTemplateFieldOptionDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      DocumentTemplateFieldOptionService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_TEMPLATE_FIELD_OPTION,
      entityId:
        DocumentTemplateFieldOptionService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_TEMPLATE_FIELD_OPTION_UPDATED,
      event: new DocumentTemplateFieldOptionUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteDocumentTemplateFieldOptionDto,
  ): Promise<DocumentTemplateFieldOptionDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.documentTemplateFieldOption.update({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
      data: {
        deletedBy: deletedBy as Prisma.InputJsonValue,
        deletedAt: new Date(),
      },
    });
    const dto = plainToInstance(
      DocumentTemplateFieldOptionDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(
      DocumentTemplateFieldOptionService.generateCacheId(dto),
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_TEMPLATE_FIELD_OPTION,
      entityId:
        DocumentTemplateFieldOptionService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_TEMPLATE_FIELD_OPTION_DELETED,
      event: new DocumentTemplateFieldOptionDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}

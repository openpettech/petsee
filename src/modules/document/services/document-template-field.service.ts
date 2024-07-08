import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, DocumentTemplateField } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateDocumentTemplateFieldDto,
  UpdateDocumentTemplateFieldDto,
  DeleteDocumentTemplateFieldDto,
  DocumentTemplateFieldCreatedEvent,
  DocumentTemplateFieldUpdatedEvent,
  DocumentTemplateFieldDeletedEvent,
  DocumentTemplateFieldDto,
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
export class DocumentTemplateFieldService {
  private readonly logger = new Logger(DocumentTemplateFieldService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/DocumentTemplateField-${id}/ID`;
  }

  static generateEntityId(entry: DocumentTemplateField) {
    return `Project-${entry.projectId}/DocumentTemplateField-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<DocumentTemplateFieldDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<DocumentTemplateFieldDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<DocumentTemplateFieldDto | null> {
    const cachedData = await this.cacheService.get(
      DocumentTemplateFieldService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        DocumentTemplateFieldDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.documentTemplateField.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      DocumentTemplateFieldDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        DocumentTemplateFieldService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.DocumentTemplateFieldWhereInput = {},
  ): Promise<PageDto<DocumentTemplateFieldDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.documentTemplateField.findMany({
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
      this.prisma.documentTemplateField.count({
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
          DocumentTemplateFieldDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, documentTemplateId, ...input }: CreateDocumentTemplateFieldDto,
  ): Promise<DocumentTemplateFieldDto> {
    const entry = await this.prisma.documentTemplateField.create({
      data: {
        ...input,
        project: createConnectObject(projectId),
        template: createConnectObject(documentTemplateId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      DocumentTemplateFieldDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      DocumentTemplateFieldService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_TEMPLATE_FIELD,
      entityId: DocumentTemplateFieldService.generateEntityId(entry),
      eventName: DocumentEvents.DOCUMENT_TEMPLATE_FIELD_CREATED,
      event: new DocumentTemplateFieldCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateDocumentTemplateFieldDto,
  ): Promise<DocumentTemplateFieldDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.documentTemplateField.update({
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
      DocumentTemplateFieldDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      DocumentTemplateFieldService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_TEMPLATE_FIELD,
      entityId: DocumentTemplateFieldService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_TEMPLATE_FIELD_UPDATED,
      event: new DocumentTemplateFieldUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteDocumentTemplateFieldDto,
  ): Promise<DocumentTemplateFieldDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.documentTemplateField.update({
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
      DocumentTemplateFieldDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(
      DocumentTemplateFieldService.generateCacheId(dto),
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_TEMPLATE_FIELD,
      entityId: DocumentTemplateFieldService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_TEMPLATE_FIELD_DELETED,
      event: new DocumentTemplateFieldDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}

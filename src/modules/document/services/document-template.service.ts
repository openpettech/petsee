import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, DocumentTemplate } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateDocumentTemplateDto,
  UpdateDocumentTemplateDto,
  DeleteDocumentTemplateDto,
  DocumentTemplateCreatedEvent,
  DocumentTemplateUpdatedEvent,
  DocumentTemplateDeletedEvent,
  DocumentTemplateDto,
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
export class DocumentTemplateService {
  private readonly logger = new Logger(DocumentTemplateService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/DocumentTemplate-${id}/ID`;
  }

  static generateEntityId(entry: DocumentTemplate) {
    return `Project-${entry.projectId}/DocumentTemplate-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<DocumentTemplateDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<DocumentTemplateDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<DocumentTemplateDto | null> {
    const cachedData = await this.cacheService.get(
      DocumentTemplateService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        DocumentTemplateDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.documentTemplate.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      DocumentTemplateDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(
        DocumentTemplateService.generateCacheId(dto),
        dto,
      );
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.DocumentTemplateWhereInput = {},
  ): Promise<PageDto<DocumentTemplateDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.documentTemplate.findMany({
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
      this.prisma.documentTemplate.count({
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
          DocumentTemplateDto,
          entry,
          DEFAULT_CLASS_TRANFORM_OPTIONS,
        ),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateDocumentTemplateDto,
  ): Promise<DocumentTemplateDto> {
    const entry = await this.prisma.documentTemplate.create({
      data: {
        ...input,
        project: createConnectObject(projectId),
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      DocumentTemplateDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      DocumentTemplateService.generateCacheId(entry),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_TEMPLATE,
      entityId: DocumentTemplateService.generateEntityId(entry),
      eventName: DocumentEvents.DOCUMENT_TEMPLATE_CREATED,
      event: new DocumentTemplateCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateDocumentTemplateDto,
  ): Promise<DocumentTemplateDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.documentTemplate.update({
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
      DocumentTemplateDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(
      DocumentTemplateService.generateCacheId(dto),
      dto,
    );

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_TEMPLATE,
      entityId: DocumentTemplateService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_TEMPLATE_UPDATED,
      event: new DocumentTemplateUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteDocumentTemplateDto,
  ): Promise<DocumentTemplateDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.documentTemplate.update({
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
      DocumentTemplateDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(DocumentTemplateService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: DocumentEntities.DOCUMENT_TEMPLATE,
      entityId: DocumentTemplateService.generateEntityId(updatedEntry),
      eventName: DocumentEvents.DOCUMENT_TEMPLATE_DELETED,
      event: new DocumentTemplateDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}

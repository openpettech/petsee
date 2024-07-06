import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Tag, TagType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateTagDto,
  UpdateTagDto,
  DeleteTagDto,
  TagCreatedEvent,
  TagUpdatedEvent,
  TagDeletedEvent,
  TagEvents,
  TagDto,
  TagEntities,
} from '@contracts/tag';
import {
  PageDto,
  PageMetaDto,
  PageOptionsDto,
  Context,
} from '@contracts/common';
import { EventAction } from '@contracts/events';
import { DEFAULT_CLASS_TRANFORM_OPTIONS } from '@constants/class-transformer.constant';

type GenerateCacheIdParams = {
  projectId: string;
  id: string;
};

type FindOneByIdParams = {
  projectId: string;
  id: string;
};

type ValidateTagsParams = {
  tagIds: string[];
  projectId: string;
  type: TagType;
};

@Injectable()
export class TagService {
  private readonly logger = new Logger(TagService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Tag-${id}/ID`;
  }

  static generateEntityId(entry: Tag) {
    return `Project-${entry.projectId}/Tag-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<TagDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<TagDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<TagDto | null> {
    const cachedData = await this.cacheService.get(
      TagService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        TagDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.tag.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(TagDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS);

    if (!!dto) {
      await this.cacheService.set(TagService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.TagWhereInput = {},
  ): Promise<PageDto<TagDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.tag.findMany({
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
      this.prisma.tag.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(TagDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateTagDto,
  ): Promise<TagDto> {
    const entry = await this.prisma.tag.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(TagDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS);

    await this.cacheService.set(TagService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: TagEntities.TAG,
      entityId: TagService.generateEntityId(entry),
      eventName: TagEvents.TAG_CREATED,
      event: new TagCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateTagDto,
  ): Promise<TagDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.tag.update({
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
      TagDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(TagService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: TagEntities.TAG,
      entityId: TagService.generateEntityId(updatedEntry),
      eventName: TagEvents.TAG_UPDATED,
      event: new TagUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(context: Context, input: DeleteTagDto): Promise<TagDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.tag.update({
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
      TagDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(TagService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: TagEntities.TAG,
      entityId: TagService.generateEntityId(updatedEntry),
      eventName: TagEvents.TAG_DELETED,
      event: new TagDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async validateTags(
    context: Context,
    { projectId, tagIds, type }: ValidateTagsParams,
  ) {
    const entry = await this.prisma.tag.findFirst({
      where: {
        projectId,
        id: {
          in: tagIds,
        },
        type: {
          not: type,
        },
      },
    });

    if (!!entry) {
      throw new BadRequestException(`Incorrect ${type} tags`);
    }
  }
}

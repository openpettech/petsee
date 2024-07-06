import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Facility } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { EventsService, CacheService, PrismaService } from '@modules/core';
import {
  CreateFacilityDto,
  UpdateFacilityDto,
  DeleteFacilityDto,
  FacilityCreatedEvent,
  FacilityUpdatedEvent,
  FacilityDeletedEvent,
  OrganizationEvents,
  FacilityDto,
  OrganizationEntities,
} from '@contracts/organization';
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

@Injectable()
export class FacilityService {
  private readonly logger = new Logger(FacilityService.name);

  static generateCacheId({ projectId, id }: GenerateCacheIdParams) {
    return `Project-${projectId}/Facility-${id}/ID`;
  }

  static generateEntityId(entry: Facility) {
    return `Project-${entry.projectId}/Facility-${entry.id}`;
  }

  constructor(
    private readonly cacheService: CacheService<FacilityDto>,
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService<FacilityDto>,
  ) {}

  async findOneById(
    context: Context,
    { projectId, id }: FindOneByIdParams,
  ): Promise<FacilityDto | null> {
    const cachedData = await this.cacheService.get(
      FacilityService.generateCacheId({ projectId, id }),
    );
    if (cachedData) {
      return plainToInstance(
        FacilityDto,
        cachedData,
        DEFAULT_CLASS_TRANFORM_OPTIONS,
      );
    }

    const entry = await this.prisma.facility.findUnique({
      where: {
        id,
        projectId,
        deletedAt: null,
      },
    });
    const dto = plainToInstance(
      FacilityDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    if (!!dto) {
      await this.cacheService.set(FacilityService.generateCacheId(dto), dto);
    }

    return dto;
  }

  async findAll(
    context: Context,
    pageOptionsDto: PageOptionsDto,
    filters: Prisma.FacilityWhereInput = {},
  ): Promise<PageDto<FacilityDto>> {
    const [entries, total] = await Promise.all([
      this.prisma.facility.findMany({
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
      this.prisma.facility.count({
        where: {
          ...filters,
          deletedAt: null,
        },
      }),
    ]);

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(
      entries.map((entry) =>
        plainToInstance(FacilityDto, entry, DEFAULT_CLASS_TRANFORM_OPTIONS),
      ),
      pageMetaDto,
    );
  }

  async create(
    context: Context,
    { projectId, ...input }: CreateFacilityDto,
  ): Promise<FacilityDto> {
    const entry = await this.prisma.facility.create({
      data: {
        ...input,
        projectId,
        createdBy: input.createdBy as Prisma.InputJsonValue,
        updatedBy: input.createdBy as Prisma.InputJsonValue,
      },
    });
    const dto = plainToInstance(
      FacilityDto,
      entry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(FacilityService.generateCacheId(entry), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.FACILITY,
      entityId: FacilityService.generateEntityId(entry),
      eventName: OrganizationEvents.FACILITY_CREATED,
      event: new FacilityCreatedEvent(),
      action: EventAction.CREATE,
      after: dto,
    });

    return dto;
  }

  async update(
    context: Context,
    { id, projectId, updatedBy, ...data }: UpdateFacilityDto,
  ): Promise<FacilityDto> {
    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.facility.update({
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
      FacilityDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.set(FacilityService.generateCacheId(dto), dto);

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.FACILITY,
      entityId: FacilityService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.FACILITY_UPDATED,
      event: new FacilityUpdatedEvent(),
      action: EventAction.UPDATE,
      before: entry,
      after: dto,
    });

    return dto;
  }

  async delete(
    context: Context,
    input: DeleteFacilityDto,
  ): Promise<FacilityDto> {
    const { id, projectId, deletedBy } = input;

    const entry = await this.findOneById(context, { projectId, id });
    if (!entry) {
      throw new NotFoundException(id);
    }

    const updatedEntry = await this.prisma.facility.update({
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
      FacilityDto,
      updatedEntry,
      DEFAULT_CLASS_TRANFORM_OPTIONS,
    );

    await this.cacheService.del(FacilityService.generateCacheId(dto));

    this.eventsService.emitEvent({
      projectId,
      entity: OrganizationEntities.FACILITY,
      entityId: FacilityService.generateEntityId(updatedEntry),
      eventName: OrganizationEvents.FACILITY_DELETED,
      event: new FacilityDeletedEvent(),
      action: EventAction.DELETE,
      before: entry,
      after: dto,
    });

    return dto;
  }
}

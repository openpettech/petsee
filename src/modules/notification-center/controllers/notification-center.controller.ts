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
  NotificationCenterDto,
  CreateNotificationCenterRequest,
  UpdateNotificationCenterRequest,
} from '@contracts/notification-center';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { NotificationCenterService } from '../services';

@ApiTags('Notification Center')
@Controller('notification-center')
@UseGuards(AuthGuard('bearer'))
export class NotificationCenterController {
  private readonly logger = new Logger(NotificationCenterController.name);

  constructor(
    private readonly notificationCenterService: NotificationCenterService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(NotificationCenterDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.notificationCenterService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: NotificationCenterDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.notificationCenterService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('NotificationCenter not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: NotificationCenterDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createNotificationCenterDto: CreateNotificationCenterRequest,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    console.log('createNotificationCenterDto', createNotificationCenterDto);

    return this.notificationCenterService.create(context, {
      projectId: context.projectId,
      createdBy: triggeredBy,
      ...createNotificationCenterDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: NotificationCenterDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateNotificationCenterDto: UpdateNotificationCenterRequest,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.notificationCenterService.update(context, {
      id,
      projectId: context.projectId,
      ...updateNotificationCenterDto,
      updatedBy: triggeredBy,
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: NotificationCenterDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    return this.notificationCenterService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: triggeredBy,
    });
  }
}

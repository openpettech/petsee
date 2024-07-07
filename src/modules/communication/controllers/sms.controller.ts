import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import {
  SmsLogDto,
  SmsLogFiltersDto,
  SendTextMessageDto,
} from '@contracts/communication';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';

import { SmsProviderService, SmsLogService } from '../services';
import { SmsStatus } from '@prisma/client';

@ApiTags('Communication')
@Controller('communication/sms')
@UseGuards(AuthGuard('bearer'))
export class SmsController {
  private readonly logger = new Logger(SmsController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly smsLogService: SmsLogService,
    private readonly smsProviderService: SmsProviderService,
  ) {}

  @Get('/logs')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(SmsLogDto)
  async list(
    @Ctx() context: Context,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() filters: SmsLogFiltersDto,
  ) {
    return this.smsLogService.findAll(context, pageOptionsDto, filters);
  }

  @Get('/logs/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SmsLogDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.smsLogService.findOneById(context, {
      projectId: context.projectId,
      id,
    });

    if (!entry) {
      throw new NotFoundException('SMS Log not found');
    }

    return entry;
  }

  @Post('/send')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: SmsLogDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    sendTextMessageDto: SendTextMessageDto,
    @TriggeredBy() triggeredBy: ServiceRole,
  ) {
    let error: Error | undefined = undefined;
    let providerId: string;
    let provider: string;
    let status: SmsStatus;

    try {
      const providerResponse = await this.smsProviderService.send(context, {
        phoneNumber: sendTextMessageDto.phoneNumber,
        message: sendTextMessageDto.message,
      });
      providerId = providerResponse.id;
      provider = providerResponse.provider;
      status = providerResponse.status;
    } catch (err: any) {
      error = err;
      status = SmsStatus.ERRORED;
      provider = this.configService.get<string>('SMS_PROVIDER');
    }

    return this.smsLogService.create(context, {
      ...sendTextMessageDto,
      provider,
      providerId,
      status,
      error: error?.message ?? undefined,
      projectId: context.projectId,
      createdBy: triggeredBy,
    });
  }
}

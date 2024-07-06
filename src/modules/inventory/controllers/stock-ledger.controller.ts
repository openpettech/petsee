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
  UseGuards,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  StockLedgerDto,
  StockLedgerTransactionRequest,
} from '@contracts/inventory';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKeyDto } from '@contracts/project';
import { ApiKey, Ctx } from '@shared/decorators';

import { StockLedgerService } from '../services';
import { StockLedgerType } from '@prisma/client';

@ApiTags('Inventory')
@Controller('stock-ledgers')
@UseGuards(AuthGuard('bearer'))
export class StockLedgerController {
  private readonly logger = new Logger(StockLedgerController.name);

  constructor(private readonly stockLedgerService: StockLedgerService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(StockLedgerDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.stockLedgerService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: StockLedgerDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.stockLedgerService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('StockLedger not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: StockLedgerDto,
  })
  async transaction(
    @Ctx() context: Context,
    @Body()
    createStockLedgerDto: StockLedgerTransactionRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    const { type, quantity } = createStockLedgerDto;
    if (type === StockLedgerType.CREDIT && quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }
    if (type === StockLedgerType.DEBIT && quantity > 0) {
      throw new BadRequestException('Quantity must be lower than or equal 0');
    }

    return this.stockLedgerService.transaction(context, {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
      ...createStockLedgerDto,
    });
  }
}

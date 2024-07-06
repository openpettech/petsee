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
  StockDto,
  CreateStockRequest,
  UpdateStockRequest,
} from '@contracts/inventory';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKeyDto } from '@contracts/project';
import { ApiKey, Ctx } from '@shared/decorators';

import { StockService } from '../services';

@ApiTags('Inventory')
@Controller('stocks')
@UseGuards(AuthGuard('bearer'))
export class StockController {
  private readonly logger = new Logger(StockController.name);

  constructor(private readonly stockService: StockService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(StockDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.stockService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: StockDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.stockService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Stock not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: StockDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createStockDto: CreateStockRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.stockService.create(context, {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
      ...createStockDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: StockDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateStockDto: UpdateStockRequest,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.stockService.update(context, {
      id,
      projectId: context.projectId,
      ...updateStockDto,
      updatedBy: {
        apiKey: apiKey.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: StockDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.stockService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: {
        apiKey: apiKey.id,
      },
    });
  }
}

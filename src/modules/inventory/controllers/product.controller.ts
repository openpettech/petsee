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
  ProductDto,
  CreateProductRequest,
  UpdateProductRequest,
} from '@contracts/inventory';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
} from '@contracts/common';
import { ApiKeyDto } from '@contracts/project';
import { ApiKey, Ctx } from '@shared/decorators';

import { ProductService } from '../services';

@ApiTags('Inventory')
@Controller('products')
@UseGuards(AuthGuard('bearer'))
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ProductDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.productService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ProductDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.productService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Product not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ProductDto,
  })
  async create(
    @Ctx() context: Context,
    @Body()
    createProductDto: CreateProductRequest,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.productService.create(context, {
      projectId: context.projectId,
      createdBy: {
        apiKey: apiKey.id,
      },
      ...createProductDto,
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully updated.',
    type: ProductDto,
  })
  async update(
    @Ctx() context: Context,
    @Body() updateProductDto: UpdateProductRequest,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.productService.update(context, {
      id,
      projectId: context.projectId,
      ...updateProductDto,
      updatedBy: {
        apiKey: apiKey.id,
      },
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
    type: ProductDto,
  })
  async delete(
    @Ctx() context: Context,
    @Param('id') id: string,
    @ApiKey() apiKey: ApiKeyDto,
  ) {
    return this.productService.delete(context, {
      id,
      projectId: context.projectId,
      deletedBy: {
        apiKey: apiKey.id,
      },
    });
  }
}

import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
  UseInterceptors,
  UploadedFile,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
// import { v4 } from 'uuid';

import { FileDto } from '@contracts/file';
import {
  PageOptionsDto,
  ApiPaginatedResponse,
  Context,
  ServiceRole,
} from '@contracts/common';
import { Ctx, TriggeredBy } from '@shared/decorators';
import { ObjectStorageService } from '@modules/core';

import { FileService } from '../services';

@ApiTags('File')
@Controller('files')
@UseGuards(AuthGuard('bearer'))
export class FileController {
  private readonly logger = new Logger(FileController.name);

  constructor(
    private readonly fileService: FileService,
    @Inject(ObjectStorageService)
    private readonly objectStorageService: ObjectStorageService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(FileDto)
  async list(@Ctx() context: Context, @Query() pageOptionsDto: PageOptionsDto) {
    return this.fileService.findAll(context, pageOptionsDto, {
      projectId: context.projectId,
    });
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: FileDto,
  })
  async get(@Ctx() context: Context, @Param('id') id: string) {
    const entry = await this.fileService.findOneById(context, {
      projectId: context.projectId,
      id,
    });
    if (!entry) {
      throw new NotFoundException('Facility not found');
    }

    return entry;
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: FileDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Ctx() context: Context,
    @TriggeredBy() triggeredBy: ServiceRole,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id, url } = await this.objectStorageService.store(context, {
      file,
      bucket: 'files',
    });

    return this.fileService.create(context, {
      id,
      url,
      size: file.size,
      filename: file.originalname,
      type: file.mimetype,
      projectId: context.projectId,
      createdBy: triggeredBy,
    });
  }
}

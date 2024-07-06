import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { v4 } from 'uuid';

import { StoreRequestDto, StoreResponseDto } from '@contracts/core';
import { Context } from '@contracts/common';

import { ObjectStorageService } from './object-storage.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioStorageService extends ObjectStorageService {
  private readonly logger = new Logger(MinioStorageService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {
    super();
  }

  async store(
    context: Context,
    {
      file,
      path: basePath,
      bucket,
      useFilename = false,
      region = 'us-east-1',
    }: StoreRequestDto,
  ): Promise<StoreResponseDto> {
    await this.prepareBucket(bucket, region);
    const id = v4();

    const ext = file.originalname.split('.')[1];
    const filename = useFilename ? file.originalname : `${id}.${ext}`;

    const path = !!basePath ? `${basePath}/${filename}` : `${filename}`;

    await this.minioService.client.putObject(
      bucket,
      path,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return {
      id,
      url: `${this.configService.get('objectStorage.domain')}/${bucket}/${path}`,
    };
  }

  private async prepareBucket(
    bucketName: string,
    region: string,
  ): Promise<void> {
    const bucketExists =
      await this.minioService.client.bucketExists(bucketName);

    if (!bucketExists) {
      await this.minioService.client.makeBucket(bucketName, region);
    }
  }
}

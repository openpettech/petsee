import { Context } from '@contracts/common';
import { StoreRequestDto, StoreResponseDto } from '@contracts/core';

export abstract class ObjectStorageService {
  abstract store(
    context: Context,
    params: StoreRequestDto,
  ): Promise<StoreResponseDto>;
}

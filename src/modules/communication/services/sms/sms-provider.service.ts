import { Context } from '@contracts/common';
import {
  SendTextMessageRequestDto,
  SendTextMessageResponseDto,
} from '@contracts/communication';

export abstract class SmsProviderService {
  abstract send(
    context: Context,
    params: SendTextMessageRequestDto,
  ): Promise<SendTextMessageResponseDto>;
}

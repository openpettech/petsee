import * as twilio from 'twilio';

import { Injectable, Logger } from '@nestjs/common';

import { Context } from '@contracts/common';

import { SmsProviderService } from './sms-provider.service';
import { ConfigService } from '@nestjs/config';
import {
  SendTextMessageRequestDto,
  SendTextMessageResponseDto,
} from '@contracts/communication';
import { MessageStatus } from 'twilio/lib/rest/api/v2010/account/message';
import { SmsStatus } from '@prisma/client';

@Injectable()
export class TwilioService extends SmsProviderService {
  private readonly logger = new Logger(TwilioService.name);
  private readonly client: twilio.Twilio;

  constructor(private readonly configService: ConfigService) {
    super();

    this.client = twilio(
      configService.get('communication.sms.twilio.accountSid'),
      configService.get('communication.sms.twilio.authToken'),
    );
  }

  async send(
    context: Context,
    sendTextMessageRequestDto: SendTextMessageRequestDto,
  ): Promise<SendTextMessageResponseDto> {
    try {
      const res = await this.client.messages.create({
        messagingServiceSid: this.configService.get(
          'communication.sms.twilio.messagingServiceSid',
        ),
        to: sendTextMessageRequestDto.phoneNumber,
        from: sendTextMessageRequestDto.from,
        body: sendTextMessageRequestDto.message,
        statusCallback: process.env.TWILIO_WEBHOOK_URL,
      });

      return {
        id: res.sid,
        provider: 'twilio',
        status: this.mapStatus(res.status),
      };
    } catch (err) {
      this.logger.error(err);
      throw new Error(err);
    }
  }

  private mapStatus(status: MessageStatus): SmsStatus {
    switch (status) {
      case 'queued':
      case 'scheduled':
        return SmsStatus.QUEUED;
      case 'accepted':
      case 'partially_delivered':
      case 'receiving':
      case 'sending':
      case 'sent':
        return SmsStatus.SENT;
      case 'delivered':
      case 'read':
      case 'received':
        return SmsStatus.DELIVERED;
      default:
        return SmsStatus.ERRORED;
    }
  }
}

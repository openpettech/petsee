import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  TwilioService as TwilioMessagingServic,
  SmsProviderService,
  SmsLogService,
} from './services';
import { SmsController } from './controllers';

const providers: Provider[] = [
  SmsLogService,
  {
    provide: SmsProviderService,
    useFactory: (configService: ConfigService) => {
      const smsProvider = configService.get<string>('SMS_PROVIDER');
      switch (smsProvider) {
        case 'twilio':
          return new TwilioMessagingServic(configService);
        default:
          throw new Error(`Unsupported sms provider: ${smsProvider}`);
      }
    },
    inject: [ConfigService],
  },
];

@Module({
  controllers: [SmsController],
  providers: [...providers],
  exports: [...providers],
})
export class CommunicationModule {}

import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetWebhookLogsDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public webhookId: string;
}

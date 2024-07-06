import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetWebhookLogByIdDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public webhookId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public id: string;
}

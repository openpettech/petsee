import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTagByIdDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public id: string;
}

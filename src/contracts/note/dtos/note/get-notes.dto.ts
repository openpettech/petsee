import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetNotesDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;
}

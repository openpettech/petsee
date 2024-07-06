import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetAnimalRelationshipByIdDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public id: string;
}

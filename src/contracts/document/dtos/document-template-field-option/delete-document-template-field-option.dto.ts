import { IsServiceRole, ServiceRole } from '@contracts/common';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class DeleteDocumentTemplateFieldOptionDto {
  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public projectId: string;

  @Expose()
  @IsUUID('4')
  @IsNotEmpty()
  public id: string;

  @Exclude()
  @IsNotEmpty()
  @IsServiceRole()
  @Type(() => ServiceRole)
  public deletedBy: ServiceRole;
}

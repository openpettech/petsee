import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Auth0UserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  public id: string;

  @Expose()
  @IsString()
  @IsOptional()
  public name?: string | null;
}

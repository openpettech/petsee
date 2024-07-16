import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchRequestDto {
  @Expose()
  @IsOptional()
  @IsString()
  @ApiProperty()
  query: string;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  limit?: number = 10;

  @ApiPropertyOptional({
    minimum: 0,
    default: 0,
  })
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number = 0;
}

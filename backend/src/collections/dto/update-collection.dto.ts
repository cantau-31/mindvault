import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCollectionDto {
  @IsString()
  @MaxLength(80)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;
}

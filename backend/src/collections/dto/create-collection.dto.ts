import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;
}

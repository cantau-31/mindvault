import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @MaxLength(120)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  collectionId?: string;
}

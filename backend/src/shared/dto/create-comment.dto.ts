import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  authorName?: string;

  @IsString()
  @MaxLength(1000)
  message: string;
}

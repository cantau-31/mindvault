import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SharedService } from './shared.service';

@Controller('shared')
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @Get(':token')
  getSharedNote(@Param('token') token: string) {
    return this.sharedService.getSharedNote(token);
  }

  @Post(':token/comments')
  addComment(@Param('token') token: string, @Body() dto: CreateCommentDto) {
    return this.sharedService.addComment(token, dto);
  }
}

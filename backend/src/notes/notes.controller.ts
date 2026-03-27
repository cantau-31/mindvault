import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

type JwtUser = {
  userId: string;
  email: string;
  role: string;
};

type AuthenticatedRequest = Request & {
  user: JwtUser;
};

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.notesService.findAllByUser(req.user.userId);
  }

  @Get('search')
  search(@Req() req: AuthenticatedRequest, @Query('q') q: string) {
    return this.notesService.search(req.user.userId, q ?? '');
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.notesService.findOneById(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.notesService.remove(req.user.userId, id);
  }

  @Post(':id/share')
  share(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.notesService.share(req.user.userId, id);
  }

  @Post(':id/summarize')
  summarize(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.notesService.summarize(req.user.userId, id);
  }
}

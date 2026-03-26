import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, ObjectId } from 'mongodb';
import { Connection } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';

type NoteDocument = {
  _id: ObjectId;
  ownerId: string;
  title: string;
  content: string;
  tags: string[];
  collectionId: string | null;
  isPrivate: boolean;
  shareToken: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type SharedCommentDocument = {
  _id: ObjectId;
  noteId: ObjectId;
  shareToken: string;
  authorName: string;
  message: string;
  createdAt: Date;
};

@Injectable()
export class SharedService {
  private readonly notesCollection: Collection<NoteDocument>;
  private readonly commentsCollection: Collection<SharedCommentDocument>;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.notesCollection = this.connection.collection<NoteDocument>('notes');
    this.commentsCollection =
      this.connection.collection<SharedCommentDocument>('shared_comments');
  }

  async getSharedNote(token: string): Promise<{
    note: Pick<
      NoteDocument,
      '_id' | 'title' | 'content' | 'tags' | 'createdAt' | 'updatedAt'
    >;
    comments: SharedCommentDocument[];
  }> {
    const cleanToken = token.trim();
    if (!cleanToken) {
      throw new BadRequestException('Share token is required');
    }

    const note = await this.notesCollection.findOne({ shareToken: cleanToken });

    if (!note) {
      throw new NotFoundException('Shared note not found');
    }

    const comments = await this.commentsCollection
      .find({ shareToken: cleanToken })
      .sort({ createdAt: 1 })
      .toArray();

    return {
      note: {
        _id: note._id,
        title: note.title,
        content: note.content,
        tags: note.tags,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
      comments,
    };
  }

  async addComment(
    token: string,
    dto: CreateCommentDto,
  ): Promise<SharedCommentDocument> {
    const cleanToken = token.trim();
    if (!cleanToken) {
      throw new BadRequestException('Share token is required');
    }

    const note = await this.notesCollection.findOne({ shareToken: cleanToken });

    if (!note) {
      throw new NotFoundException('Shared note not found');
    }

    const doc: Omit<SharedCommentDocument, '_id'> = {
      noteId: note._id,
      shareToken: cleanToken,
      authorName: dto.authorName?.trim() || 'Anonymous',
      message: dto.message,
      createdAt: new Date(),
    };

    const result = await this.commentsCollection.insertOne(
      doc as SharedCommentDocument,
    );

    return {
      _id: result.insertedId,
      ...doc,
    };
  }
}

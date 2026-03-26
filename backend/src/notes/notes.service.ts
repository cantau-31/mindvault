import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, ObjectId } from 'mongodb';
import { Connection } from 'mongoose';
import { randomBytes } from 'crypto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

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

@Injectable()
export class NotesService {
  private readonly notesCollection: Collection<NoteDocument>;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.notesCollection = this.connection.collection<NoteDocument>('notes');
  }

  async create(userId: string, dto: CreateNoteDto): Promise<NoteDocument> {
    const now = new Date();
    const doc: Omit<NoteDocument, '_id'> = {
      ownerId: userId,
      title: dto.title,
      content: dto.content ?? '',
      tags: dto.tags ?? [],
      collectionId: dto.collectionId ?? null,
      isPrivate: true,
      shareToken: null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.notesCollection.insertOne(doc as NoteDocument);
    return { _id: result.insertedId, ...doc };
  }

  async findAllByUser(userId: string): Promise<NoteDocument[]> {
    return this.notesCollection
      .find({ ownerId: userId })
      .sort({ updatedAt: -1 })
      .toArray();
  }

  async findOneById(userId: string, noteId: string): Promise<NoteDocument> {
    const note = await this.findOwnedNoteOrThrow(userId, noteId);
    return note;
  }

  async update(
    userId: string,
    noteId: string,
    dto: UpdateNoteDto,
  ): Promise<NoteDocument> {
    const note = await this.findOwnedNoteOrThrow(userId, noteId);

    const updateData: Partial<NoteDocument> = {
      updatedAt: new Date(),
    };

    if (dto.title !== undefined) {
      updateData.title = dto.title;
    }
    if (dto.content !== undefined) {
      updateData.content = dto.content;
    }
    if (dto.tags !== undefined) {
      updateData.tags = dto.tags;
    }
    if (dto.collectionId !== undefined) {
      updateData.collectionId = dto.collectionId;
    }

    await this.notesCollection.updateOne({ _id: note._id }, { $set: updateData });

    return {
      ...note,
      ...updateData,
    };
  }

  async remove(userId: string, noteId: string): Promise<{ message: string }> {
    const note = await this.findOwnedNoteOrThrow(userId, noteId);
    await this.notesCollection.deleteOne({ _id: note._id });
    return { message: 'Note deleted successfully' };
  }

  async search(userId: string, q: string): Promise<NoteDocument[]> {
    const term = q.trim();
    if (!term) {
      throw new BadRequestException('Query parameter q is required');
    }

    return this.notesCollection
      .find({
        ownerId: userId,
        $or: [
          { title: { $regex: term, $options: 'i' } },
          { content: { $regex: term, $options: 'i' } },
        ],
      })
      .sort({ updatedAt: -1 })
      .toArray();
  }

  async share(userId: string, noteId: string): Promise<{ shareToken: string }> {
    const note = await this.findOwnedNoteOrThrow(userId, noteId);

    if (note.shareToken) {
      return { shareToken: note.shareToken };
    }

    const shareToken = await this.generateUniqueShareToken();

    await this.notesCollection.updateOne(
      { _id: note._id },
      {
        $set: {
          shareToken,
          updatedAt: new Date(),
        },
      },
    );

    return { shareToken };
  }

  private async findOwnedNoteOrThrow(
    userId: string,
    noteId: string,
  ): Promise<NoteDocument> {
    const parsedId = this.parseObjectId(noteId);
    const note = await this.notesCollection.findOne({ _id: parsedId });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.ownerId !== userId) {
      throw new ForbiddenException('You cannot access this note');
    }

    return note;
  }

  private parseObjectId(value: string): ObjectId {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid note id');
    }
    return new ObjectId(value);
  }

  private async generateUniqueShareToken(): Promise<string> {
    for (let i = 0; i < 5; i += 1) {
      const token = randomBytes(16).toString('hex');
      const existing = await this.notesCollection.findOne({ shareToken: token });
      if (!existing) {
        return token;
      }
    }

    throw new BadRequestException('Unable to generate share token, try again');
  }
}

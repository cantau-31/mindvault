import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({ timestamps: true })
export class Note {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200,
  })
  title: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
  })
  content: string;

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Collection',
    default: null,
    index: true,
  })
  collectionId?: Types.ObjectId | null;

  @Prop({
    type: String,
    trim: true,
    default: null,
  })
  shareToken?: string | null;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.index({ title: 1 });
NoteSchema.index({ content: 1 });
NoteSchema.index(
  { shareToken: 1 },
  {
    unique: true,
    partialFilterExpression: { shareToken: { $type: 'string' } },
  },
);

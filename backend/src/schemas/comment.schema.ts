import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
})
export class Comment {
  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  noteShareToken: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 80,
  })
  authorName: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
  })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.index({ noteShareToken: 1, createdAt: -1 });

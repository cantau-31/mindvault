import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CollectionDocument = HydratedDocument<Collection>;

@Schema({ timestamps: true })
export class Collection {
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
    maxlength: 120,
  })
  name: string;

  @Prop({
    type: String,
    trim: true,
    maxlength: 500,
    default: null,
  })
  description?: string | null;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
CollectionSchema.index({ userId: 1, name: 1 }, { unique: true });

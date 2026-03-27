import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ default: 'MEMBER', enum: ['ADMIN', 'MEMBER'] })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

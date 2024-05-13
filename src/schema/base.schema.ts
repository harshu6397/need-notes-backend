import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BaseModel extends Document {
  @Prop({ default: () => BigInt(Date.now()).toString(), required: true })
  createdAt: number;

  @Prop({ default: () => BigInt(Date.now()).toString(), required: true })
  updatedAt: number;

  @Prop({ default: true, required: true })
  isActive: boolean;

  @Prop({ required: false, default: null })
  comment: string;
}

export const BaseSchema = SchemaFactory.createForClass(BaseModel);

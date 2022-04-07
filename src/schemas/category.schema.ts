import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CategoryDocument = Category & Document;

@Schema({ versionKey: false })
export class Category {
  @Prop({ required: false })
  parent: Types.ObjectId;

  @Prop()
  image: string;

  @Prop({ required: true })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

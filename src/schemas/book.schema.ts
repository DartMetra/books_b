import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BookDocument = Book & Document;

@Schema({ versionKey: false })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ ref: "Category" })
  categories: Types.ObjectId[];

  @Prop({ required: true, ref: "Author" })
  author: Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  date: Date;

  @Prop()
  publisher: Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);

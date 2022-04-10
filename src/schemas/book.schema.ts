import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type BookDocument = Book & Document;

@Schema({ versionKey: false })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ ref: "categories" })
  categories: Types.ObjectId[];

  @Prop({ required: true, ref: "authors" })
  author: Types.ObjectId;

  @Prop({ required: false, ref: "genres" })
  genres: Types.ObjectId[];

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  date: Date;

  @Prop({ ref: "publishers" })
  publisher: Types.ObjectId;
}

export const BookSchema = SchemaFactory.createForClass(Book);

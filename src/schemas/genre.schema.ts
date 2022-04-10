import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type GenreDocument = Genre & Document;

@Schema({ versionKey: false })
export class Genre {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);

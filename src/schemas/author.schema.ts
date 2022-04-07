import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type AuthorDocument = Author & Document;

@Schema({ versionKey: false })
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

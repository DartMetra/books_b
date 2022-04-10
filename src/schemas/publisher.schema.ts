import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PublisherDocument = Publisher & Document;

@Schema({ versionKey: false })
export class Publisher {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FavoriteDocument = Favorite & Document;

@Schema({ versionKey: false })
export class Favorite {
  @Prop({ required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  book: Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

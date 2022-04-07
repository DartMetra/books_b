import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  passwordHash: string;

  @Prop({ default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

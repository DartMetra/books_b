import { Types } from "mongoose";

export class CreateBook {
  title: string;

  categories: Types.ObjectId[];

  author: Types.ObjectId;

  description: string;

  image?: string;

  date: Date;

  publisher: Types.ObjectId;
}

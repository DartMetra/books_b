import { Types } from "mongoose";

export class CreateBook {
  title: string;

  categories?: Types.ObjectId[];

  genres?: Types.ObjectId[];

  author: Types.ObjectId;

  description: string;

  image?: string;

  date: string;

  publisher: Types.ObjectId;
}

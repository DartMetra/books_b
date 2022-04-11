import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Book } from "src/schemas/book.schema";
import { Model, Types } from "mongoose";
import { CreateBook } from "./dto/createBook.dto";

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private readonly Book: Model<Book>) {}

  async search(
    pag: { skip: number; limit: number; order: 1 | -1; sortBy: string } = { skip: 0, limit: 20, order: -1, sortBy: "_id" },
    query?: string
  ) {
    const PIPELINE = [];

    const SORT = {
      $sort: {},
    };

    if (query) {
      PIPELINE.push({
        $search: {
          "index": "books_search",
          "text": {
            "query": query,
            "path": "title",
            "fuzzy": {},
          },
        },
      });
      PIPELINE.push({ $addFields: { score: { $meta: "searchScore" } } });

      SORT["$sort"]["score"] = -1;
    } else {
      SORT["$sort"][pag.sortBy] = pag.order;
    }

    PIPELINE.push({
      "$lookup": {
        from: "authors",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    });

    PIPELINE.push({
      "$set": {
        author: { $first: "$author" },
      },
    });

    PIPELINE.push({
      "$lookup": {
        from: "genres",
        localField: "genres",
        foreignField: "_id",
        as: "genres",
      },
    });

    PIPELINE.push({
      "$lookup": {
        from: "publishers",
        localField: "publisher",
        foreignField: "_id",
        as: "publisher",
      },
    });

    PIPELINE.push({
      "$set": {
        publisher: { $first: "$publisher" },
      },
    });

    PIPELINE.push({
      "$facet": {
        books: [SORT, { $skip: pag.skip }, { $limit: pag.limit }],
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    });

    console.log(PIPELINE);
    return (await this.Book.aggregate(PIPELINE))[0];
  }

  async create(data: CreateBook) {
    return await this.Book.create(data);
  }

  async findById(_id: Types.ObjectId) {
    return (
      await this.Book.aggregate([
        {
          $match: {
            "_id": _id,
          },
        },
        {
          "$lookup": {
            from: "authors",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          "$lookup": {
            from: "publishers",
            localField: "publisher",
            foreignField: "_id",
            as: "publisher",
          },
        },
        {
          "$lookup": {
            from: "genres",
            localField: "genres",
            foreignField: "_id",
            as: "genres",
          },
        },
        {
          "$set": {
            author: { $first: "$author" },
            publisher: { $first: "$publisher" },
          },
        },
      ])
    )[0];
  }

  async update(_id: Types.ObjectId, data: Partial<CreateBook>) {
    return await this.Book.updateOne({ _id }, data, { upsert: true });
  }

  async delete(_id: Types.ObjectId) {
    return await this.Book.deleteMany({ _id });
  }
}

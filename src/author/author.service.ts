import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Author } from "src/schemas/author.schema";
import { Model, Types } from "mongoose";
import { CreateAuthor } from "./dto/createAuthor.dto";

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private readonly Author: Model<Author>) {}

  async search(
    pag: { skip: number; limit: number; order: 1 | -1; sortBy: string } = { skip: 0, limit: 20, order: -1, sortBy: "_id" },
    query?: string
  ) {
    const PIPELINE = [];

    const SORT = {
      $sort: {},
    };
    SORT["$sort"][pag.sortBy] = pag.order;

    if (query) {
      PIPELINE.push({
        $search: {
          "index": "author",
          "text": {
            "query": query,
            "path": "name",
            "fuzzy": {},
          },
        },
      });
    }

    PIPELINE.push({
      "$facet": {
        authors: [SORT, { $skip: pag.skip }, { $limit: pag.limit }],
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    });

    console.log(PIPELINE);
    return (await this.Author.aggregate(PIPELINE))[0];
  }

  async create(data: CreateAuthor) {
    return await this.Author.create(data);
  }

  async findById(_id: Types.ObjectId) {
    return await this.Author.findById(_id);
  }

  async update(_id: Types.ObjectId, data: Partial<CreateAuthor>) {
    return await this.Author.updateOne({ _id }, data, { upsert: true });
  }

  async delete(_id: Types.ObjectId) {
    return await this.Author.deleteMany({ _id });
  }
}

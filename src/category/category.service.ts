import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "src/schemas/category.schema";
import { Model, Types } from "mongoose";
import { CreateCategory } from "./dto/createCategory.dto";

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private readonly Category: Model<Category>) {}
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
          "index": "category_search",
          "text": {
            "query": query,
            "path": {
              "wildcard": "*",
            },
            "fuzzy": {},
          },
        },
      });
    }

    PIPELINE.push({
      "$facet": {
        categories: [SORT, { $skip: pag.skip }, { $limit: pag.limit }],
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    });

    console.log(PIPELINE);
    return (await this.Category.aggregate(PIPELINE))[0];
  }

  async create(data: CreateCategory) {
    return await this.Category.create(data);
  }

  async findById(_id: Types.ObjectId) {
    return await this.Category.findById(_id);
  }

  async update(_id: Types.ObjectId, data: Partial<CreateCategory>) {
    return await this.Category.updateOne({ _id }, data, { upsert: true });
  }

  async delete(_id: Types.ObjectId) {
    return await this.Category.deleteMany({ _id });
  }
}

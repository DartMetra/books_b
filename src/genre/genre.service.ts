import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Genre } from "src/schemas/genre.schema";
import { Model, Types } from "mongoose";
import { CreateGenre } from "./dto/createGenre.dto";

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre.name) private readonly Genre: Model<Genre>) {}
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
        $match: {
          $or: [{ "name": { $regex: query } }, { "description": { $regex: query } }],
        },
      });
    }

    PIPELINE.push({
      "$facet": {
        genres: [SORT, { $skip: pag.skip }, { $limit: pag.limit }],
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    });

    console.log(PIPELINE);
    return (await this.Genre.aggregate(PIPELINE))[0];
  }

  async create(data: CreateGenre) {
    return await this.Genre.create(data);
  }

  async findById(_id: Types.ObjectId) {
    return await this.Genre.findById(_id);
  }

  async update(_id: Types.ObjectId, data: Partial<CreateGenre>) {
    return await this.Genre.updateOne({ _id }, data, { upsert: true });
  }

  async delete(_id: Types.ObjectId) {
    return await this.Genre.deleteMany({ _id });
  }
}

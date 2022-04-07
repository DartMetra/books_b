import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Publisher } from "src/schemas/publisher.schema";
import { Model, Types } from "mongoose";
import { CreatePublisher } from "./dto/createPublisher.dto";

@Injectable()
export class PublisherService {
  constructor(@InjectModel(Publisher.name) private readonly Publisher: Model<Publisher>) {}
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
        publishers: [SORT, { $skip: pag.skip }, { $limit: pag.limit }],
        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    });

    console.log(PIPELINE);
    return (await this.Publisher.aggregate(PIPELINE))[0];
  }

  async create(data: CreatePublisher) {
    return await this.Publisher.create(data);
  }

  async findById(_id: Types.ObjectId) {
    return await this.Publisher.findById(_id);
  }

  async update(_id: Types.ObjectId, data: Partial<CreatePublisher>) {
    return await this.Publisher.updateOne({ _id }, data, { upsert: true });
  }

  async delete(_id: Types.ObjectId) {
    return await this.Publisher.deleteMany({ _id });
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Pagination } from "src/utils/pagination.decorator";
import { PublisherService } from "./publisher.service";
import { Types } from "mongoose";
import { CreatePublisher } from "./dto/createPublisher.dto";
import { extname } from "path";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Controller("/publisher")
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get("/")
  async getPublishers(@Pagination() pagination, @Query("query") query) {
    const { publishers, totalCount } = await this.publisherService.search(pagination, query);
    console.log(totalCount);
    return { publishers, totalCount: totalCount[0] ? totalCount[0].count : 0 };
  }

  @Get("/:id")
  async getPublisherById(@Param("id") _id: Types.ObjectId) {
    return await this.publisherService.findById(_id);
  }

  @Post("/")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./public/publisher",
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
    })
  )
  async createPublisher(@UploadedFile() image: Express.Multer.File, @Body() createPublisher: CreatePublisher) {
    createPublisher.image = image.path;
    return await this.publisherService.create(createPublisher);
  }

  @Patch("/:id")
  async updatePublisher(@Param("id") _id: Types.ObjectId, @Body() updatePublisher: Partial<CreatePublisher>) {
    return await this.publisherService.update(_id, updatePublisher);
  }

  @Delete("/:id")
  async deletePublisher(@Param("id") _id: Types.ObjectId) {
    return await this.publisherService.delete(_id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Pagination } from "src/utils/pagination.decorator";
import { AuthorService } from "./author.service";
import { CreateAuthor } from "./dto/createAuthor.dto";
import { Types } from "mongoose";

@Controller("/author")
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get("/")
  async getAuthors(@Pagination() pagination, @Query("query") query) {
    const { authors, totalCount } = await this.authorService.search(pagination, query);
    console.log(totalCount);
    return { authors, totalCount: totalCount[0] ? totalCount[0].count : 0 };
  }

  @Get("/:id")
  async getAuthorById(@Param("id") _id: Types.ObjectId) {
    return await this.authorService.findById(_id);
  }

  @Post("/")
  async createAuthor(@Body() createAuthor: CreateAuthor) {
    return await this.authorService.create(createAuthor);
  }

  @Patch("/:id")
  async updateAuthor(@Param("id") _id: Types.ObjectId, @Body() updateAuthor: Partial<CreateAuthor>) {
    return await this.authorService.update(_id, updateAuthor);
  }

  @Delete("/:id")
  async deleteAuthor(@Param("id") _id: Types.ObjectId) {
    return await this.authorService.delete(_id);
  }
}

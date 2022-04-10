import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Pagination } from "src/utils/pagination.decorator";

import { Types } from "mongoose";
import { CreateGenre } from "./dto/createGenre.dto";
import { GenreService } from "./genre.service";

@Controller("/genre")
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get("/")
  async getGenres(@Pagination() pagination, @Query("query") query) {
    const { genres, totalCount } = await this.genreService.search(pagination, query);
    console.log(totalCount);
    return { genres, totalCount: totalCount[0] ? totalCount[0].count : 0 };
  }

  @Get("/:id")
  async getGenreById(@Param("id") _id: Types.ObjectId) {
    return await this.genreService.findById(_id);
  }

  @Post("/")
  async createGenre(@Body() createGenre: CreateGenre) {
    return await this.genreService.create(createGenre);
  }

  @Patch("/:id")
  async updateGenre(@Param("id") _id: Types.ObjectId, @Body() updateGenre: Partial<CreateGenre>) {
    return await this.genreService.update(_id, updateGenre);
  }

  @Delete("/:id")
  async deleteGenre(@Param("id") _id: Types.ObjectId) {
    return await this.genreService.delete(_id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Pagination } from "src/utils/pagination.decorator";
import { BookService } from "./book.service";
import { Types } from "mongoose";
import { CreateBook } from "./dto/createBook.dto";

@Controller("/book")
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get("/")
  async getBooks(@Pagination() pagination, @Query("query") query) {
    const { books, totalCount } = await this.bookService.search(pagination, query);
    console.log(totalCount);
    return { books, totalCount: totalCount[0] ? totalCount[0].count : 0 };
  }

  @Get("/:id")
  async getBookById(@Param("id") _id: Types.ObjectId) {
    return await this.bookService.findById(_id);
  }

  @Post("/")
  async createBook(@Body() createBook: CreateBook) {
    return await this.bookService.create(createBook);
  }

  @Patch("/:id")
  async updateBook(@Param("id") _id: Types.ObjectId, @Body() updateBook: Partial<CreateBook>) {
    return await this.bookService.update(_id, updateBook);
  }

  @Delete("/:id")
  async deleteBook(@Param("id") _id: Types.ObjectId) {
    return await this.bookService.delete(_id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Pagination } from "src/utils/pagination.decorator";
import { CategoryService } from "./category.service";
import { CreateCategory } from "./dto/createCategory.dto";
import { Types } from "mongoose";

@Controller("/category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get("/")
  async getCategorys(@Pagination() pagination, @Query("query") query) {
    const { categories, totalCount } = await this.categoryService.search(pagination, query);
    console.log(totalCount);
    return { categories, totalCount: totalCount[0] ? totalCount[0].count : 0 };
  }

  @Get("/:id")
  async getCategoryById(@Param("id") _id: Types.ObjectId) {
    return await this.categoryService.findById(_id);
  }

  @Post("/")
  async createCategory(@Body() createCategory: CreateCategory) {
    return await this.categoryService.create(createCategory);
  }

  @Patch("/:id")
  async updateCategory(@Param("id") _id: Types.ObjectId, @Body() updateCategory: Partial<CreateCategory>) {
    return await this.categoryService.update(_id, updateCategory);
  }

  @Delete("/:id")
  async deleteCategory(@Param("id") _id: Types.ObjectId) {
    return await this.categoryService.delete(_id);
  }
}

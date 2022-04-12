import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AdminGuard } from "../utils/admin.guard";
import { TokenGuard } from "../utils/token.guard";
import { Types } from "mongoose";
import { Pagination } from "src/utils/pagination.decorator";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/auth/login")
  async login(@Body() { email, password }) {
    return await this.userService.login(email, password);
  }

  @Post("/auth/registration")
  async register(@Body() { email, password }) {
    return await this.userService.register(email, password);
  }

  @Post("/auth/refresh")
  async refresh(@Body() { refreshToken }) {
    return await this.userService.refresh(refreshToken);
  }

  @UseGuards(TokenGuard)
  @Post("/favorite")
  async addToFavorite(@Body() { _id }, @Req() req) {
    const user = req.user;
    return await this.userService.addToFavorite(new Types.ObjectId(_id), new Types.ObjectId(user._id));
  }

  @UseGuards(TokenGuard)
  @Get("/favorite")
  async getFavorite(@Pagination() pagination, @Req() req) {
    const { favorite, totalCount } = await this.userService.getFavorite(pagination, new Types.ObjectId(req.user._id));
    return { favorite, totalCount: totalCount[0] ? totalCount[0].count : 0 };
  }
}

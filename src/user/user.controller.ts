import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AdminGuard } from "../utils/admin.guard";
import { TokenGuard } from "../utils/token.guard";

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
  @Get("/")
  async getUsers() {}

  @Get("/:id")
  async getUserById(@Param("id") id) {}

  @Post("/")
  async createUser() {}

  @Patch("/:id")
  async updateUser(@Param("id") id) {}

  @Delete("/:id")
  async deleteUser(@Param("id") id) {}
}

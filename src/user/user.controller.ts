import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/auth/login")
  async login() {}

  @Post("/auth/register")
  async register() {}

  @Post("/auth/refresh")
  async refresh() {}

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

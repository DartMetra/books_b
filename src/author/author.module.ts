import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Author, AuthorSchema } from "src/schemas/author.schema";
import { AuthorController } from "./author.controller";
import { AuthorService } from "./author.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }])],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Author, AuthorSchema } from "src/schemas/author.schema";
import { Book, BookSchema } from "src/schemas/book.schema";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}

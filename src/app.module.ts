import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { CategoryModule } from "./category/category.module";
import { UserModule } from "./user/user.module";
import { PublisherModule } from "./publisher/publisher.module";
import { AuthorModule } from "./author/author.module";
import { BookModule } from "./book/book.module";
import { GenreModule } from "./genre/genre.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "/public",
    }),
    ConfigModule.forRoot({
      envFilePath: ".local.env",
      isGlobal: true,
    }),
    BookModule,
    CategoryModule,
    UserModule,
    PublisherModule,
    AuthorModule,
    GenreModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "public",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("DB"),

        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "myFirstDatabase",
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

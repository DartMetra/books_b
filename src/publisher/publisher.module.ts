import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Publisher, PublisherSchema } from "src/schemas/publisher.schema";
import { PublisherController } from "./publisher.controller";
import { PublisherService } from "./publisher.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Publisher.name, schema: PublisherSchema }])],
  controllers: [PublisherController],
  providers: [PublisherService],
})
export class PublisherModule {}

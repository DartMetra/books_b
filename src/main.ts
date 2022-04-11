import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as morgan from "morgan";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true });
  app.use(morgan("dev"));
  const config = app.get(ConfigService);

  await app.listen(config.get("PORT"), config.get("HOST"));
}
bootstrap();

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest().query;

  return {
    skip: req.skip ? +req.skip : 0,
    limit: req.limit ? +req.limit : 20,
    order: req.order ? +req.order : -1,
    sortBy: req.sortBy ? req.sortBy : "_id",
  };
});

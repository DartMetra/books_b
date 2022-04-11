import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { Observable } from "rxjs";

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const auth: string = req.headers.authorization;
      const token: string = auth.split(" ")[1];

      req.user = verify(token, "123");
      return req.user.isAdmin;
    } catch (e) {
      throw new UnauthorizedException("access token error");
    }
  }
}

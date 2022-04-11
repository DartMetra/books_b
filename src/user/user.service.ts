import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { Model } from "mongoose";
import { sign, verify } from "jsonwebtoken";
import { hashSync, compareSync } from "bcrypt";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly User: Model<User>) {}

  async login(email, password) {
    const user = await this.User.findOne({ email });
    if (!user) {
      return;
    }

    if (compareSync(password, user.passwordHash)) {
      return {
        accessToken: await this.genAccessToken(user.toObject()),
        refreshToken: await this.genRefreshToken(user.toObject()),
        user: user.toObject(),
        isAdmin: user.isAdmin,
      };
    }
    throw new BadRequestException("login error");
  }

  async refresh(token) {
    const tokenData: any = await this.verifyRefreshToken(token);
    if (tokenData) {
      const user = await this.User.findOne({ _id: tokenData._id });
      return {
        accessToken: await this.genAccessToken(user.toObject()),
        refreshToken: await this.genRefreshToken(user.toObject()),
        user: user.toObject(),
        isAdmin: user.isAdmin,
      };
    } else {
      throw new BadRequestException("refresh error");
    }
  }

  async register(email, password) {
    console.log(email, password);
    const passwordHash = hashSync(password, 3);
    const user = await this.User.create({ email, isAdmin: false, passwordHash: passwordHash });
    return {
      accessToken: await this.genAccessToken(user.toObject()),
      refreshToken: await this.genRefreshToken(user.toObject()),
      user: user.toObject(),
      isAdmin: user.isAdmin,
    };
  }

  async genAccessToken({ email, _id, isAdmin }) {
    return sign({ email, _id, isAdmin }, "123", { expiresIn: "20m" });
  }

  async verifyAccessToken(token: string) {
    return verify(token, "123");
  }

  async genRefreshToken({ _id }) {
    return sign({ _id }, "321", { expiresIn: "1d" });
  }

  async verifyRefreshToken(token: string) {
    return verify(token, "321");
  }
}

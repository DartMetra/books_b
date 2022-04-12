import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { Model } from "mongoose";
import { sign, verify } from "jsonwebtoken";
import { hashSync, compareSync } from "bcrypt";
import { Favorite } from "src/schemas/favorite.schema";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly User: Model<User>, @InjectModel(Favorite.name) private readonly Favorite: Model<Favorite>) {}

  async addToFavorite(book, user) {
    return await this.Favorite.updateMany({ book, user }, {}, { upsert: true });
  }

  async getFavorite(pag: { skip: number; limit: number; order: 1 | -1; sortBy: string } = { skip: 0, limit: 20, order: -1, sortBy: "_id" }, user) {
    const SORT = {
      $sort: {},
    };
    SORT["$sort"][pag.sortBy] = pag.order;

    return (
      await this.Favorite.aggregate([
        {
          "$lookup": {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "book_n",
          },
        },
        {
          "$lookup": {
            from: "authors",
            localField: "book_n.author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          "$lookup": {
            from: "genres",
            localField: "book_n.genres",
            foreignField: "_id",
            as: "genres",
          },
        },
        {
          "$set": {
            book: "$book_n",
          },
        },
        {
          "$set": {
            "book.author": { $first: "$author" },
            "book.publisher": { $first: "$publisher" },
            "book.genres": "$genres",
          },
        },
        {
          $project: {
            book_n: 0,
            author: 0,
            publisher: 0,
          },
        },
        {
          "$facet": {
            favorite: [SORT, { $skip: pag.skip }, { $limit: pag.limit }],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        },
      ])
    )[0];
  }

  async login(email, password) {
    const user = await this.User.findOne({ email });
    if (!user) {
      throw new BadRequestException("login error");
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
    try {
      return verify(token, "123");
    } catch (e) {
      throw new UnauthorizedException("access token error");
    }
  }

  async genRefreshToken({ _id }) {
    return sign({ _id }, "321", { expiresIn: "20d" });
  }

  async verifyRefreshToken(token: string) {
    try {
      return verify(token, "321");
    } catch (e) {
      throw new UnauthorizedException("access token error");
    }
  }
}

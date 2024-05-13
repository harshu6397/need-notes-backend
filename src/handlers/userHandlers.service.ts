import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class UserHandlers {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async generateAccessAndRefreshTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.userModel.findOne({ _id: userId });

      if (!user) {
        throw new Error('User not found');
      }

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      // Attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error('Something went wrong while generating the access token');
    }
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { refreshToken: undefined } },
      { new: true },
    );
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}

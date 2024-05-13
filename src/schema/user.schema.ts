import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import {
  AVAILABLE_SOCIAL_LOGINS,
  AVAILABLE_USER_ROLES,
  USER_LOGIN_TYPE,
  USER_TEMPORARY_TOKEN_EXPIRY_20_MINUTES,
} from '../constants/appConstants.json';
import { NextFunction } from 'express';

@Schema()
export class User extends BaseModel {
  @Prop({
    type: {
      url: String,
      localPath: String,
    },
    default: {
      url: 'https://via.placeholder.com/200x200.png',
      localPath: '',
    },
  })
  avatar: {
    url: string;
    localPath: string;
  };

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({
    enum: AVAILABLE_USER_ROLES,
    default: AVAILABLE_USER_ROLES.USER,
    required: true,
  })
  role: string;

  @Prop({ required: [true, 'Password is required'] })
  password: string;

  @Prop({
    enum: AVAILABLE_SOCIAL_LOGINS,
    default: USER_LOGIN_TYPE.EMAIL_PASSWORD,
  })
  loginType: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  refreshToken: string;

  @Prop()
  forgotPasswordToken: string;

  @Prop()
  forgotPasswordExpiry: number;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  emailVerificationExpiry: number;

  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  generateTemporaryToken: () => {
    unHashedToken: string;
    hashedToken: string;
    tokenExpiry: number;
  };
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

/**
 * @description Method responsible for generating tokens for email verification, password reset etc.
 */
UserSchema.methods.generateTemporaryToken = function () {
  // This token should be client facing
  // for example: for email verification unHashedToken should go into the user's mail
  const unHashedToken = crypto.randomBytes(20).toString('hex');

  // This should stay in the DB to compare at the time of verification
  const hashedToken = crypto
    .createHash('sha256')
    .update(unHashedToken)
    .digest('hex');
  // This is the expiry time for the token (20 minutes)
  const tokenExpiry =
    Date.now() + USER_TEMPORARY_TOKEN_EXPIRY_20_MINUTES * 60 * 1000;

  return { unHashedToken, hashedToken, tokenExpiry };
};

export { UserSchema };

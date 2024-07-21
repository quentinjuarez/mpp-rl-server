import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export const SourceType = ["internal", "google", "guest"] as const;

export type SourceType = (typeof SourceType)[number];

export type UserDTO = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
  coverPicture: string;
  description: string;
  isDemo: boolean;
  isAdmin: boolean;
  source: SourceType;
  externalId: string;
};

export interface UserDocument extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
  coverPicture: string;
  description: string;
  isDemo: boolean;
  isAdmin: boolean;
  source: SourceType;
  externalId: string;
  createdAt: string;
  updatedAt: string;
}

const UserSchema: Schema<UserDocument> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: SourceType,
      default: "internal",
    },
    externalId: {
      type: String,
      default: "",
    },
  },
  { collection: "users", timestamps: true },
);

UserSchema.pre<UserDocument>("save", function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  // hash the password using our new salt
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

export const User: Model<UserDocument> = mongoose.model<UserDocument>(
  "User",
  UserSchema,
);

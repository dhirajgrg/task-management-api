import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "please provie name"],
      min: 3,
      max: 20,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      toLowerCase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid Email format",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
  },
  {
    timestamps: true,
  },
);

//==============hash password======================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

//=============== password changed timestamp==============
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
});

//=============== create passwored reset token===============
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//==================compare timestamp==========
userSchema.methods.changedPasswordAfter = function (JWTTimestamps) {
  if (!passwordChangedAt) return false;
  const passwordChangedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
  );

  return JWTTimestamps < passwordChangedTimestamp;
};

//==========compare password================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model("User", userSchema);
export default User;

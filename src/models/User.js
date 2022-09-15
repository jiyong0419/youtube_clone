import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, requred: true, unique: true },
  username: { type: String, requred: true, unique: true },
  password: { type: String },
  name: { type: String, requred: true },
  location: String,
  socialLogin: { type: Boolean, default: false },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;

import mongoose from "mongoose";
import bcrypt from "bcrypt"; // bcrypt는 password를 해싱해준다.

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: String,
  location: String,
  socialLogin: { type: Boolean, default: false },
  avatarUrl: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], //ObjectId 타입은 mongoose에서 제공하는 16진수 24자리다.  ref:"Video"는 이 videos의 요소는 Video Model을 참조한다는 뜻
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
}); // Schema는 데이터의 타입과 비고를 작성하는 곳

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5); // this는 저장되려는 스키마
  }
});

const User = mongoose.model("User", userSchema); // MongoDB에 user db가 생성되고 user db는 userSchema형식을 따른다

export default User;

import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/youtube_clone", {
  //useNewUrlParser: true;
  //useUnifiedTopology: true;
  //useFindAndModify: true;
  //useCreateIndex:true;  스키마에 unique를 썻을때 발생하는 경고를 해결
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error ", error);
db.on("error", (error) => console.log("DB Error ", error));
db.once("open", handleOpen);

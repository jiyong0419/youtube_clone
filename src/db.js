import mongoose from "mongoose"; // mongoose는 express와 MongoDB를 연결해준다.

mongoose.connect(process.env.DB_URL, {
  //useNewUrlParser: true;
  //useUnifiedTopology: true;
  //useFindAndModify: true;
  //useCreateIndex:true;  스키마에 unique를 썻을때 발생하는 경고를 해결
}); // mongoose야 express와 나의 MongoDB주소를 연동시켜줘

const db = mongoose.connection; // db는 express와 MongoDB간의 연결 정보

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error ", error);
db.on("error", (error) => console.log("DB Error ", error));
db.once("open", handleOpen);

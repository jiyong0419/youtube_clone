"use strict";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () => {
  console.log(`β Server listening on port http://localhost:${PORT} π`);
};

app.listen(PORT, handleListening); // μλ²μ ν¬νΈλ²νΈ λΆμ¬νκ³ , μλ² ν¬νΈκ° μ΄λ¦¬λ©΄ μ½λ°±ν¨μ μ€ν

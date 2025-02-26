import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(router);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

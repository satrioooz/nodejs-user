import Express from "express";
import DB from "./config/db-config.js";
import router from "./router/index.js";
import dotEnv from "dotenv";
import cookieParser from "cookie-parser";

dotEnv.config();
const app = Express();
app.use(cookieParser());
app.use(Express.json());
app.use("/api", router);

try {
  await DB.authenticate();
  console.log("Server connect Successfuly");
} catch (error) {
  console.log("err", error);
}

app.listen(8000, () => console.log("Server running at port 8000"));

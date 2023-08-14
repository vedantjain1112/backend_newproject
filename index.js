const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const allDataRouter = require("./routers/dataRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./.env" });
const cors = require("cors");
const infoRouter = require("./routers/infoRouter");
const FRONTEND_URL = process.env.FRONTEND_URL;

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);

app.use("/auth", authRouter);
app.use("/data", allDataRouter);
app.use("/info", infoRouter);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.status(200).send("ok from server");
});

const PORT = process.env.PORT || 4001;

dbConnect();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

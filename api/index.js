import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

dotenv.config();

app.use(express.json());

app.use(cookieParser());

mongoose.connect(process.env.MONGO).then(() => {
  console.log("connected on db");
});

const __dirname = path.resolve();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}
app.use((err, req, res, next) => {
  const message = err.message || "Something went wrong";
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

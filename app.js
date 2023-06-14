require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

// connectDB
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());

app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("e-commerce api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = 3000 || process.env.PORT;

const start = async () => {
  try {
    // connectDB
    const url = process.env.DATABASE.replace(
      "<password>",
      process.env.DATABASE_PASSWORD
    );
    await connectDB(url);

    app.listen(
      port,
      console.log(`App running on port: http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

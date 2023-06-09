require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// connectDB
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());

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

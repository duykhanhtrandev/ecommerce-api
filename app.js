require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");

// connectDB
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRouter);

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

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser')
const cors = require("cors")
//configuring env
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "backend/config/config.env" });
}
//using middleware
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: true,limit:'50mb' }));
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: `http://localhost:3000`,
}))


//importing routes
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

//using routes
app.use("/api/v1", postRoutes);
app.use("/api/v1", userRoutes);

// localhost:4000/api/v1/post/upload

module.exports = app;

// importing
const express = require("express");
const { connectMongoDB } = require("./connection");
require("dotenv").config();
const authentication = require("./routes/authentication/user");
const blogs = require("./routes/blogs/blogs");
const user = require("./routes/user/user");
const { validateUser } = require("./middleware/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//initialization
const app = express();
const PORT = process.env.PORT || 5000;
const DBName = "BloggingWebsite";
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// connection to DB
connectMongoDB(`${process.env.dbURL}${DBName}`)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(`MongoDB Connection Error\nError :\t${error}`));

// middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use("/authentication", authentication);
app.use("/blogs", blogs);
app.use("/user", validateUser, user);
/* app.get("/isAuthenticate", validateUser, (request, response) => {
  response.status(200).json({ statusCode: 200 });
}); */
app.use(express.static("public"));

// listening
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));

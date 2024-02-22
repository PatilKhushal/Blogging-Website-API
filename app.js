// importing
const express = require("express");
const { connectMongoDB } = require("./connection");
require("dotenv").config();
const authentication = require('./routes/authentication/user')

//initialization
const app = express();
const PORT = process.env.PORT || 5000;
const DBName = "BloggingWebsite";


// connection to DB
connectMongoDB(`${process.env.dbURL}${DBName}`)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(`MongoDB Connection Error\nError :\t${error}`));

// middlewares
app.use(express.urlencoded({extended: false}))
app.use('/authentication', authentication);

// inital get
app.get("/", (request, response) => {
  return response.send("GET / endpoint");
});


// listening
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));

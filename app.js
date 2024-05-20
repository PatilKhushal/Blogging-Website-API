// importing
const express = require("express");
const { connectMongoDB } = require("./connection");
require("dotenv").config();
const blogs = require("./routes/blogs/blogs");
const user = require("./routes/user/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require('./middleware/auth');
const session = require("express-session");
const passport = require("passport");
const { isAuthenticated } = require("./middleware/isAuthenticated");
const MongoStore = require("connect-mongo");

//initialization
const app = express();
const PORT = process.env.PORT || 5000;
const DBName = "BloggingWebsite";
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
const mongoStore = new MongoStore({
  ttl : 14 * 24 * 60 * 60,
  mongoUrl : process.env.SESSIONSTOREATLASURL
})

// connection to DB
connectMongoDB(
  process.env.ATLASURL
)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(`MongoDB Connection Error\nError :\t${error}`));

// middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'patilkhushal2803CaptainJack-TheSparrow28@03',
  resave: false,
  saveUninitialized: false,
  store : mongoStore
}));
app.use(passport.authenticate('session'));

passport.serializeUser(function(user, cb) {
  return cb(null, user);
});

passport.deserializeUser(function(user, cb) {
    return cb(null, user);
});

app.use('/', authRouter);
app.use("/blogs", blogs);
app.use("/user",isAuthenticated,user);
app.use(express.static("public"));
app.get('/isAuthenticated', (request, response) => {
  console.log('request.user', request.user)
  if(request.user)
    return response.status(200).json({ statusCode: 200, user : request.user });
  return response.status(401).json({ statusCode: 401 });
});

// listening
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
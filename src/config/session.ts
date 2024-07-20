import session from "express-session";
import MongoStore from "connect-mongo";

// Set up session middleware with MongoStore
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  ttl: 14 * 24 * 60 * 60, // Session TTL in seconds (optional)
});

const sessionMiddleware = session({
  secret: process.env.API_KEY,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
});

export default sessionMiddleware;

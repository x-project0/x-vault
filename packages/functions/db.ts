import mongoose from "mongoose";

// Once we connect to the database once, we'll store that connection
// and reuse it so that we don't have to connect to the database on every request.
let cachedDb: typeof mongoose | null = null;

const createMongoDbURI = () => {
  const mongoDbUri = process.env.MONGODB_URI;
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  console.log({ mongoDbUri, username, password });
  //our mongouri is like =mongodb+srv://<username>:<password>@xvault.i8zmvny.mongodb.net/?retryWrites=true&w=majority&appName=XVault
  // we need to remove the placeholder username and password and replace them with the actual values
  const mongoDbUriWithoutUsernameAndPassword = mongoDbUri
    .replace(`<username>`, username)
    .replace(`<password>`, password);

  console.log({ mongoDbUriWithoutUsernameAndPassword });
  return mongoDbUriWithoutUsernameAndPassword;
};

export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    console.log("Connecting to database");
    const db = await mongoose.connect(createMongoDbURI());
    cachedDb = db;
    console.log("Connected to database");

    return db;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

export const disconnectFromDatabase = async () => {
  if (cachedDb) {
    await cachedDb.disconnect();
    cachedDb = null;
  }
};
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: Date,
  updatedAt: Date,
});

const tweetSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  tweetId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author_username: {
    type: String,
    required: true,
  },
  isThread: {
    type: Boolean,
    required: true,
  },
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
    default: null,
    required: false
  },
  replyToTweetId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Tweet = mongoose.model("Tweet", tweetSchema);
export type Tweet = mongoose.InferSchemaType<typeof tweetSchema>;

export const User = mongoose.model("User", userSchema);

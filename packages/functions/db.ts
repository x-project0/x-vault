import mongoose from "mongoose";
import { Resource } from "sst";




// Once we connect to the database once, we'll store that connection
// and reuse it so that we don't have to connect to the database on every request.
let cachedDb: typeof mongoose | null = null;

const createMongoDbURI = () => {
  const mongoDbPassword = Resource.XMongoDBPassword.value;
  const mongoDbUsername = Resource.XMongoDBUsername.value;
  const mongoDbDatabase = Resource.XMongoDBDatabase.value;
  const mongoDbHost = Resource.XMongoDBHost.value;

  // we need to create a mongoDbUri like: mongodb://username:password@localhost:27017/mydatabase?retryWrites=true&w=majority
  const mongoDbUriWithoutUsernameAndPassword = `mongodb+srv://${mongoDbUsername}:${mongoDbPassword}@${mongoDbHost}/${mongoDbDatabase}?retryWrites=true&w=majority&ssl=true`;
  return mongoDbUriWithoutUsernameAndPassword;
};

export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(createMongoDbURI());
    cachedDb = db;
 

    return db;
  } catch (error) {
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
    type: mongoose.Schema.Types.Boolean,
    default: false,
    required:false
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
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Tweet = mongoose.model("Tweet", tweetSchema);
export type Tweet = mongoose.InferSchemaType<typeof tweetSchema>;

export const User = mongoose.model("User", userSchema);

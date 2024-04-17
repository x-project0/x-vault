// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb";
import { Resource } from "sst";


const createMongoDbURI = () => {
  const mongoDbPassword = Resource.XMongoDBPassword.value;
  const mongoDbUsername = Resource.XMongoDBUsername.value;
  const mongoDbDatabase = Resource.XMongoDBDatabase.value;
  const mongoDbHost = Resource.XMongoDBHost.value;

  // we need to create a mongoDbUri like: mongodb://username:password@localhost:27017/mydatabase?retryWrites=true&w=majority
  const mongoDbUriWithoutUsernameAndPassword = `mongodb+srv://${mongoDbUsername}:${mongoDbPassword}@${mongoDbHost}/${mongoDbDatabase}?retryWrites=true&w=majority&ssl=true`;
  return mongoDbUriWithoutUsernameAndPassword;
};

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(createMongoDbURI(), options);
    // @ts-ignore
    global._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(createMongoDbURI(), options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;


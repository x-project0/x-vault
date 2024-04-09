import { Resource } from "sst";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  APIGatewayProxyHandlerV2,
} from "aws-lambda";
import { User, connectToDatabase } from "./db";
import mongoose from "mongoose";

// import {  } from "aws-lambda";

// export const handler: APIGatewayProxyHandler = async (event) => {
//   return {
//     statusCode: 200,
//     body: `Id: ${event.pathParameters.id}`,
//   };
// };

export const create: APIGatewayProxyHandlerV2 = async (
  event,
  context,
  callback
) => {
  const body = JSON.parse(event.body);
  console.log({ body });
  console.log(context);
  console.log("Hello World");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Your payload is: " + event.body }),
  };
};

export const list = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const body = JSON.parse(event.body);
  console.log(body);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};

export const get: APIGatewayProxyHandlerV2 = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('Entering get');
  try {
    console.log('Calling connectToDatabase');
    await connectToDatabase();
    const filters = event.pathParameters;
    const queryStrings = event.queryStringParameters;
    const user = await User.findOne({ name: "Ned Stark" });

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: 'Error connecting to database',
    };
  }
};

// index.ts
import { Hono } from "hono";
import books from "./book";
import tweets from "./tweet";

const app = new Hono();

const routes = app.route("/", tweets).route("/", books);

export type AppType = typeof routes;

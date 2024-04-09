

// export type AppType = typeof route

import { AppType } from "../../functions/appInstance";
import { hc } from "hono/client";

export const client = hc<AppType>("https://ddnvg417vk17l.cloudfront.net");

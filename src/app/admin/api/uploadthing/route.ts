import { createRouteHandler } from "uploadthing/next";
import { adminUploadRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: adminUploadRouter,
});

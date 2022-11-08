import { buildResponse } from "@/utils/response";
import { Route } from "..";
import posts from "./posts.json";

const route: Route = {
  path: "/views/:post",
  method: ["PUT", "GET"],
  handler: async ({ url, request, env, params }) => {
    const { VIEWS: views } = env;

    const postSlug = params.post;
    if (!postSlug) {
      return buildResponse(
        {
          error: "you must provide postSlug",
        },
        400
      );
    }

    if (!posts.some((post) => post === postSlug)) {
      return buildResponse({ error: "post with provided slug not found" }, 404);
    }

    const id = views.idFromName(url.pathname);
    const stub = views.get(id);

    return stub.fetch(request);
  },
};

export default route;

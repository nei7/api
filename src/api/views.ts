import { Route } from "..";
import posts from "./posts.json";

const route: Route = {
  path: "/views/:post",
  method: ["PUT", "GET"],
  handler: async ({ url, request, env, params }) => {
    const { VIEWS: views } = env;

    const postSlug = params.post;
    if (!postSlug) {
      return {
        status: 400,
        error: "you must provide postSlug",
      };
    }

    if (!posts.some((post) => post === postSlug)) {
      return {
        error: "post with provided slug not found",
        status: 404,
      };
    }

    const id = views.idFromName(url.pathname);
    const stub = views.get(id);

    return stub.fetch(
      new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
      })
    );
  },
};

export default route;

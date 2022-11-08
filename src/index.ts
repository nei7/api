import { buildResponse } from "./utils/response";
import { viewsApi, spotifyApi } from "./api";
import processCronTrigger from "./processCronTrigger";

type Handler<T = Record<string, string>> = (params: {
  url: URL;
  body?: object;
  request: Request;
  env: Bindings;
  params: T;
}) => Response | Promise<Response>;

type HttpMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH";

export interface Route {
  path: string;
  method: HttpMethod | HttpMethod[];
  handler: Handler;
}

const isMethod =
  (method: string) => (route: { method: HttpMethod | HttpMethod[] }) =>
    Array.isArray(route.method)
      ? route.method.some((m) => m.toUpperCase() === method)
      : method === "*" || method === route.method.toUpperCase();

const isPath = (url: URL) => (path: string) => {
  const pattern = new URLPattern({
    pathname: path,
  });

  return pattern.test(url);
};

const routes: Route[] = [viewsApi, spotifyApi];

export async function handleRequest(request: Request, env: Bindings) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return buildResponse({}, 200);
  }

  const { handler, path } =
    routes.find(
      (route) => isMethod(request.method)(route) && isPath(url)(route.path)
    ) || {};

  try {
    const params =
      new URLPattern({
        pathname: path,
      }).exec(url)?.pathname.groups || {};

    const body = request.body
      ? await request.json<object>().catch(() => undefined)
      : {};
    const response = handler
      ? await handler({ url, body, request, env, params })
      : buildResponse(
          {
            error: "Not found",
          },
          404
        );

    return response;
  } catch (error) {
    console.log(error);
    return buildResponse(
      {
        error: (error as any).message || "Internal Server error",
      },
      500
    );
  }
}

const worker: ExportedHandler<Bindings> = {
  fetch: handleRequest,
  scheduled: processCronTrigger,
};

export { Views } from "./views";
export default worker;

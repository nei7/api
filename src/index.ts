import { buildResponse } from "./utils/response";
import { viewsApi, spotifyApi, newsletterApi } from "./api";
import processCronTrigger from "./processCronTrigger";

export interface IResponse {
  status: number;
  error?: string;
  data?: any;
}

type Handler<T = Record<string, string>> = (params: {
  url: URL;
  body?: any;
  request: Request;
  env: Bindings;
  params: T;
}) => Promise<IResponse> | Promise<Response> | Response;

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

const routes: Route[] = [viewsApi, spotifyApi, newsletterApi];

export async function handleRequest(request: Request, env: Bindings) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return buildResponse(
      {
        status: 200,
      },
      request.headers
    );
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

    if (handler) {
      const response = await handler({ url, body, request, env, params });
      return response instanceof Response
        ? response
        : buildResponse(response, request.headers);
    }

    return buildResponse(
      {
        status: 404,
        error: "Not found",
      },

      request.headers
    );
  } catch (error) {
    console.log(error);
    return buildResponse(
      {
        status: 500,
        error: (error as any).message || "Internal Server error",
      },
      request.headers
    );
  }
}

const worker: ExportedHandler<Bindings> = {
  fetch: handleRequest,
  scheduled: processCronTrigger,
};

export { Views } from "./views";
export default worker;

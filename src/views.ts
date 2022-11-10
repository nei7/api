import { buildResponse } from "./utils/response";

export class Views implements DurableObject {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const { size: views } = await this.state.storage.list();

    switch (request.method) {
      case "GET":
        return buildResponse(
          {
            status: 200,
            data: { views },
          },
          request.headers
        );
      case "PUT":
        const ip = request.headers.get("CF-Connecting-IP");
        if (!ip) {
          return buildResponse(
            { error: "Can't get ip", status: 400 },
            request.headers
          );
        }

        if (!(await this.state.storage.get(ip))) {
          await this.state.storage.put(ip, null);
        }

        return buildResponse(
          {
            status: 201,
            data: { views },
          },
          request.headers
        );
    }

    return buildResponse({ status: 404, error: "Not found" }, request.headers);
  }
}

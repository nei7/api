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
        // eslint-disable-next-line no-case-declarations
        const ip = request.headers.get("CF-Connecting-IP");
        if (!ip) {
          return buildResponse(
            { status: 400, data: { views, error: "Can't get ip" } },
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

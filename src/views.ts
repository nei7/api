import { buildResponse } from "./utils/response";

export class Views implements DurableObject {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(request: Request): Promise<Response> {
    const { size: views } = await this.state.storage.list();

    switch (request.method) {
      case "GET":
        return buildResponse({
          views,
        });
      case "PUT":
        const ip = request.headers.get("CF-Connecting-IP");
        if (!ip) {
          return buildResponse({ error: "Can't get ip" }, 400);
        }

        if (!(await this.state.storage.get(ip))) {
          await this.state.storage.put(ip, null);
        }

        return buildResponse({
          views,
        });
    }

    return buildResponse(
      {
        error: "Not found",
      },
      404
    );
  }
}

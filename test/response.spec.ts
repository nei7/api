import { buildResponse } from "@/response";

test("should build response", async () => {
  const res = buildResponse({ text: "text" });
  expect(res.status).toBe(200);
  expect(res.headers.get("Content-Type")).toBe("application/json");
  expect(await res.text()).toContain(
    JSON.stringify({
      text: "text",
    })
  );
});

test("should build response with custom status", () => {
  const res = buildResponse({ error: "not found" }, 404);
  expect(res.status).toBe(404);
});

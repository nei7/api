import { handleRequest } from "@/index";

test("should redirect to example page on no route match", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost"), env);
  expect(res.status).toBe(302);
  expect(res.headers.get("Location")).toBe("http://localhost/test/increment");
});

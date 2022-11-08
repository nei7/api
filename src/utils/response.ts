const origin = "http://localhost:3000";

export function buildResponse(obj: object, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "*",
    },
  });
}

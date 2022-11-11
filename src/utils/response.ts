import { IResponse } from "..";

const allowedOrigins = [
  "http://localhost:3000",
  "https://fszarek.me",
  "https://www.fszarek.me",
];

export function buildResponse(obj: IResponse, headers: Headers) {
  const origin = headers.get("Origin") || "";

  const cors = {
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Origin":
      allowedOrigins.find((allowedOrigin) => allowedOrigin.includes(origin)) ||
      allowedOrigins[0],
    "Access-Control-Allow-Headers": "*",
  };

  return new Response(JSON.stringify(obj.data || obj), {
    status: obj.status,
    headers: {
      "Content-Type": "application/json",
      ...cors,
    },
  });
}

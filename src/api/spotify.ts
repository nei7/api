import { buildResponse } from "@/utils/response";
import { $fetch } from "ohmyfetch";
import { Route } from "..";

const getAccessToken = (
  clientId: string,
  clientSecret: string,
  refresh_token: string
) => {
  const basic = btoa(`${clientId}:${clientSecret}`);
  return $fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
};

const getNowPlaying = async ({
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
}: Bindings) => {
  const { access_token } = await getAccessToken(
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN
  );

  return $fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const route: Route = {
  path: "/spotify",
  method: "GET",
  handler: async ({ env }) => {
    const playing = await getNowPlaying(env);
    return {
      status: 200,
      data: playing,
    };
  },
};

export default route;

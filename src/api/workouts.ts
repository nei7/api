import { dumpWorkouts, getWorkouts } from "@/utils/huami";
import { Route } from "..";

const route: Route = {
  path: "/stats/workouts",
  method: "GET",
  handler: async ({ request, env }) => {
    // const cache = await caches.open("workouts");

    // const response = await cache.match(request);
    // if (response) return response;

    const { data } = await getWorkouts(env.HUAMI_APP_TOKEN);

    const workouts = dumpWorkouts(data.summary);

    return {
      status: 200,
      data: workouts,
    };
  },
};

export default route;

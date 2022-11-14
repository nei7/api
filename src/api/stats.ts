import { getActivities, parseActivities } from "@/utils/huami";
import { Route } from "..";

const route: Route = {
  path: "/stats",
  method: "GET",
  handler: async ({ env, request }) => {
    // const cache = await caches.open("stats");

    // const response = await cache.match(request);
    // if (response) return response;

    const now = new Date();

    const computeDate = (offset = 0) =>
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() - offset}`;

    const activitiesResponse = await getActivities(env.HUAMI_APP_TOKEN, {
      // Last 11 days
      from_date: computeDate(11),
      to_date: computeDate(),
    });

    const activities = parseActivities(activitiesResponse.data);
    // cache.put(request, new Response({}));

    return {
      status: 200,
      data: activities,
    };
  },
};

export default route;

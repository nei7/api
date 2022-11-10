import { $fetch } from "ohmyfetch";
import { Route } from "..";

const route: Route = {
  path: "/newsletter",
  method: "POST",
  handler: async ({ body, env }) => {
    const email = body?.email;

    if (!email) {
      return {
        status: 400,
        error: "email is required",
      };
    }
    const data = await $fetch("https://www.getrevue.co/api/v2/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${env.REVUE_API_KEY}`,
      },
      body: {
        email,
      },
    }).catch((err) => ({
      error: err.data.error.email,
    }));

    if (data.error) {
      return {
        status: 500,
        data,
      };
    }

    return {
      status: 201,
      data,
    };
  },
};

export default route;

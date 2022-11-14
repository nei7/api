import { Activity, Response, Summary, Workout } from "@/@types/huami";
import { $fetch } from "ohmyfetch";

const apiUrl = "https://api-mifit.huami.com";

export function getWorkouts(apptoken: string) {
  return $fetch<
    Response<{
      summary: Workout[];
    }>
  >("/v1/sport/run/history.json", {
    baseURL: apiUrl,
    headers: {
      apptoken,
      appname: "com.xiaomi.hm.health",
      appPlatform: "web",
    },
  });
}

export function getActivities(
  apptoken: string,
  {
    from_date,
    to_date,
    userid = "7064241805",
  }: {
    from_date: string;
    to_date: string;
    userid?: string;
  }
) {
  return $fetch<Response<Activity[]>>(
    `/v1/data/band_data.json?query_type=summary&device_type=android&userid=${userid}&from_date=${from_date}&to_date=${to_date}`,
    {
      baseURL: apiUrl,
      headers: {
        apptoken,
        appname: "com.xiaomi.hm.health",
        appPlatform: "web",
      },
    }
  );
}

export function parseActivities(activities: Activity[]): Stat[] {
  return activities.map((activity) => {
    const { slp, stp } = JSON.parse(atob(activity.summary)) as Summary;

    const totalSleepTime = slp.dp + slp.lt;
    return {
      sleep: {
        hours: Math.floor(totalSleepTime / 60),
        minutes: totalSleepTime / 60,
        deepSleep: slp.dp,
        lightSleep: slp.lt,
        total: totalSleepTime,
      },
      steps: {
        total: stp.ttl,
        calories: stp.cal,
        distance: stp.dis,
      },
      date: activity.date_time,
      uuid: activity.uuid,
    };
  });
}

interface Stat {
  sleep: {
    hours: number;
    minutes: number;
    deepSleep: number;
    lightSleep: number;
  };
  steps: {
    total: number;
    calories: number;
    distance: number;
  };
  date: string;
  uuid: string;
}

interface IWorkout {
  id: string;
  calories: number;
  endTime: number;
  time: number;
  heartRate: number;
  type: number;
  maxHeartRate: number;
  minHeartRate: number;
}

export function dumpWorkouts(workouts: Workout[]): IWorkout[] {
  return workouts.map(
    ({
      trackid,
      calorie,
      end_time,
      run_time,
      avg_heart_rate,
      type,
      min_heart_rate,
      max_heart_rate,
    }) => ({
      id: trackid,
      calories: Number(calorie),
      endTime: Number(end_time),
      time: Number(run_time),
      heartRate: Number(avg_heart_rate),
      type,
      maxHeartRate: max_heart_rate,
      minHeartRate: min_heart_rate,
    })
  );
}

export interface Response<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface Activity {
  uid: string;
  data_type: 0;
  date_time: string;
  source: number;
  summary: string;
  uuid: string;
}

export interface Summary {
  v: number;
  slp: {
    // Slept from
    st: number;

    // Slept to
    ed: number;

    // Deep sleep
    dp: number;

    // LightSleep
    lt: number;

    wk: number;
    usrSt: number;
    usrEd: number;
    wc: number;
    is: number;
    lb: number;
    to: number;
    dt: number;
    rhr: number;
    ss: number;
  };

  stp: {
    // Total steps
    ttl: number;

    // Total distance (meters)
    dis: number;

    // Calories
    cal: number;

    wk: number;
    rn: number;
    runDist: number;
    runCal: number;

    stage: {
      start: number;
      stop: number;
      mode: ActivityMode;
      dis: number;
      cal: number;
      step: number;
    }[];
  };
  goal: number;
  tz: "3600";
  sn: string;
  byteLength: number;
  sync: number;
}

export enum ActivityMode {
  SlowWalking = 1,
  FastWalking = 3,
  Running = 4,
  LightActivity = 7,
}

export interface Workout {
  trackid: string;
  source: string;
  dis: string;
  calorie: string;
  end_time: string;
  run_time: string;
  avg_pace: string;
  avg_frequency: string;
  avg_heart_rate: string;
  type: number;
  max_heart_rate: number;
  min_heart_rate: number;
}

import * as v from "valibot";

const dayOfWeek = {
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
} as const;
export const dayOfWeekValues = Object.values(dayOfWeek);

export const eventSchema = v.pipe(
  v.object({
    eventName: v.string(),
    description: v.string(),
    dayOfWeek: v.array(
      v.union(dayOfWeekValues.map((value) => v.literal(value))),
    ),
    startTime: v.pipe(v.string(), v.isoTime("The time is badly formatted.")),
    endTime: v.pipe(v.string(), v.isoTime("The time is badly formatted.")),
  }),
  v.forward(
    v.partialCheck(
      [["startTime"], ["endTime"]],
      (input) => input.startTime <= input.endTime,
      "終了時刻は開始時刻より後にしてください。",
    ),
    ["endTime"],
  ),
);

export type Event = v.InferInput<typeof eventSchema>;

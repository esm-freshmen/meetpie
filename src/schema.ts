import * as v from "valibot";

export const EventSchema = v.object({
  eventName: v.string(),
  description: v.string(),
});

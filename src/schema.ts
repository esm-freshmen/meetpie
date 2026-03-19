import * as v from 'valibot';

export const eventSchema = v.object({
  eventName: v.string(),
  description: v.string(),
  dayOfWeek: v.array(v.string())
});

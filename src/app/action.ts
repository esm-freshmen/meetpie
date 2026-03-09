"use server";

import * as v from "valibot";
import { parseWithValibot } from "@conform-to/valibot";
import { eventSchema } from "@/schema";

export async function createEvent(prevState: unknown, formData: FormData) {
  const submission = parseWithValibot(formData, { schema: eventSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // TODO: 登録APIよぶ
  console.log(submission.value);
}

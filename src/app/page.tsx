"use client";

import { useActionState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { createEvent } from "@/app/action";
import { dayOfWeekValues, eventSchema } from "@/schema";
import { TimeSlider } from "@/app/_components/time-slider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, action] = useActionState(createEvent, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithValibot(formData, { schema: eventSchema });
    },
    shouldRevalidate: "onInput",
    defaultValue: {
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  console.log(form.allErrors);
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center `}
    >
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <FormProvider context={form.context}>
          <form
            {...getFormProps(form)}
            action={action}
            className="w-full max-w-sm space-y-4"
          >
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  <label htmlFor={fields.eventName.id}>イベント名</label>
                </legend>
                <input
                  {...getInputProps(fields.eventName, { type: "text" })}
                  className="input"
                  placeholder="Type here"
                />
              </fieldset>
              {fields.eventName.errors && (
                <p className="text-red-500">{fields.eventName.errors[0]}</p>
              )}
            </div>
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  <label htmlFor={fields.description.id}>説明</label>
                </legend>
                <input
                  {...getInputProps(fields.description, { type: "text" })}
                  className="input"
                  placeholder="Type here"
                />
              </fieldset>
              {fields.description.errors && (
                <p className="text-red-500">{fields.description.errors[0]}</p>
              )}
            </div>
            <fieldset>
              <label>曜日</label>
              {dayOfWeekValues.map((value) => (
                <div key={value}>
                  <label htmlFor={`${fields.dayOfWeek.id}-${value}`}>
                    {value}
                  </label>
                  <input
                    {...getInputProps(fields.dayOfWeek, {
                      type: "checkbox",
                      value,
                    })}
                    defaultChecked
                    className="checkbox checkbox-primary"
                    id={`${fields.dayOfWeek.id}-${value}`}
                  />
                </div>
              ))}
              {fields.dayOfWeek.errors && (
                <p className="text-red-500">{fields.dayOfWeek.errors[0]}</p>
              )}
            </fieldset>
            <TimeSlider formId={form.id} />
            <button className="btn btn-primary">作成</button>
          </form>
        </FormProvider>
      </main>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import {
  getFormProps,
  getInputProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { createEvent } from "@/app/action";
import { dayOfWeekValues, eventSchema } from "@/schema";
import { Slider } from "@/components/ui/slider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hoursToTime = (hours: number): string => {
  const h = Math.floor(hours).toString().padStart(2, "0");
  const m = hours % 1 === 0.5 ? "30" : "00";
  return `${h}:${m}`;
};

const timeToHours = (time: string): number => {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h + (m || 0) / 60;
};

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, action] = useActionState(createEvent, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithValibot(formData, { schema: eventSchema });
    },
    shouldRevalidate: "onInput",
    defaultValue: {
      startTime: "9",
      endTime: "18"
    }
  });

  const startTimeControl = useInputControl(fields.startTime);
  const endTimeControl = useInputControl(fields.endTime);

  const startHours = timeToHours(startTimeControl.value ?? "")
  const endHours = timeToHours(endTimeControl.value ?? "")

  console.log(form.allErrors);
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center `}
    >
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16sm:items-start">
        <form {...getFormProps(form)} action={action} className="space-y-4">
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
          <div className="space-y-2">
            <label>
              時間: {hoursToTime(startHours)} 〜 {hoursToTime(endHours)}
            </label>
            <input {...getInputProps(fields.startTime, { type: "hidden" })} />
            <input {...getInputProps(fields.endTime, { type: "hidden" })} />
            <Slider
              min={0}
              max={24}
              step={0.5}
              // value={[startHours, endHours]}
              defaultValue={[ startHours, endHours]}
              className="range range-primary"
              onValueChange={([start, end]) => {
                startTimeControl.change(hoursToTime(start));
                endTimeControl.change(hoursToTime(end));
              }}
              onBlur={() => {
                startTimeControl.blur();
                endTimeControl.blur();
              }}
            />
            {(fields.startTime.errors || fields.endTime.errors) && (
              <p className="text-red-500">
                {fields.startTime.errors?.at(0) ?? fields.endTime.errors?.at(0)}
              </p>
            )}
          </div>
          <button className="btn btn-primary">作成</button>
        </form>
      </main>
    </div>
  );
}

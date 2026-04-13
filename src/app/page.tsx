"use client";

import { useActionState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";
import { createEvent } from "@/app/action";
import { dayOfWeekValues, eventSchema } from "@/schema";

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
  });

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
          <div>
            <label htmlFor={fields.startTime.id}>時間</label>
            <input {...getInputProps(fields.startTime, { type: "time" })} />
            <span>〜</span>
            <input {...getInputProps(fields.endTime, { type: "time" })} />
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

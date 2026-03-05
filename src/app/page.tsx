"use client";

import { Geist, Geist_Mono } from "next/font/google";
import * as v from "valibot";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithValibot } from "@conform-to/valibot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const schema = v.object({
  eventName: v.string(),
  description: v.string(),
});

export default function Home() {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithValibot(formData, { schema });
    },
    shouldRevalidate: "onInput",
    onSubmit(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("submitされました！");
    },
  });

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center `}
    >
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16sm:items-start">
        <form {...getFormProps(form)} method="post" className="space-y-4">
          <div>
            <label htmlFor={fields.eventName.id}>イベント名</label>
            <input
              {...getInputProps(fields.eventName, { type: "text" })}
              className="outline outline-cyan-400"
            />
            {fields.eventName.errors && (
              <p className="text-red-500">{fields.eventName.errors[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor={fields.description.id}>説明</label>
            <input
              {...getInputProps(fields.description, { type: "text" })}
              className="outline outline-cyan-400"
            />
            {fields.description.errors && (
              <p className="text-red-500">{fields.description.errors[0]}</p>
            )}
          </div>
          <button>作成</button>
        </form>
      </main>
    </div>
  );
}

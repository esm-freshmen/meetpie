'use client';

import { useActionState } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parseWithValibot } from '@conform-to/valibot';
import { createEvent } from '@/app/action';
import { dayOfWeekValues, eventSchema } from '@/schema';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, action] = useActionState(createEvent, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithValibot(formData, { schema: eventSchema });
    },
    shouldRevalidate: 'onInput'
  });

  return (
    <div className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center `}>
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16sm:items-start">
        <form {...getFormProps(form)} action={action} className="space-y-4">
          <div>
            <label htmlFor={fields.eventName.id}>イベント名</label>
            <input {...getInputProps(fields.eventName, { type: 'text' })} className="outline outline-cyan-400" />
            {fields.eventName.errors && <p className="text-red-500">{fields.eventName.errors[0]}</p>}
          </div>
          <div>
            <label htmlFor={fields.description.id}>説明</label>
            <input {...getInputProps(fields.description, { type: 'text' })} className="outline outline-cyan-400" />
            {fields.description.errors && <p className="text-red-500">{fields.description.errors[0]}</p>}
          </div>
          <fieldset>
            曜日
            {dayOfWeekValues.map((value) => (
              <div key={value}>
                <label>{value}</label>
                <input
                  type="checkbox"
                  name={fields.dayOfWeek.name}
                  value={value}
                  defaultChecked={
                    fields.dayOfWeek.initialValue && Array.isArray(fields.dayOfWeek.initialValue)
                      ? fields.dayOfWeek.initialValue.includes(value)
                      : fields.dayOfWeek.initialValue === value
                  }
                />
              </div>
            ))}
            {fields.dayOfWeek.errors && <p className="text-red-500">{fields.dayOfWeek.errors[0]}</p>}
          </fieldset>
          <button>作成</button>
        </form>
      </main>
    </div>
  );
}

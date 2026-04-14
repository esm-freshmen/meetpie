"use client";

import {
  getInputProps,
  useFormMetadata,
  useInputControl,
} from "@conform-to/react";
import type { FormId } from "@conform-to/react";
import { Slider } from "@/components/ui/slider";
import { Event } from "@/schema";

const hoursToTime = (hours: number): string => {
  const h = Math.floor(hours).toString().padStart(2, "0");
  const m = hours % 1 === 0.5 ? "30" : "00";
  return `${h}:${m}`;
};

const timeToHours = (time = ""): number => {
  if (!time || !time.includes(":")) return 0;
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
};

export function TimeSlider({ formId }: { formId: FormId<Event> }) {
  const form = useFormMetadata(formId);
  const startField = form.getFieldset().startTime;
  const endField = form.getFieldset().endTime;
  const startControl = useInputControl(startField);
  const endControl = useInputControl(endField);

  const startHours = timeToHours(startControl.value);
  const endHours = timeToHours(endControl.value);

  return (
    <div className="space-y-2">
      <input {...getInputProps(startField, { type: "hidden" })} />
      <input {...getInputProps(endField, { type: "hidden" })} />
      <label>
        時間: {hoursToTime(startHours)} 〜 {hoursToTime(endHours)}
      </label>
      <div className="px-4">
        <Slider
          min={0}
          max={24}
          step={0.5}
          defaultValue={[startHours, endHours]}
          className="range range-primary overflow-visible"
          onValueChange={([start, end]) => {
            startControl.change(hoursToTime(start));
            endControl.change(hoursToTime(end));
          }}
          onBlur={() => {
            startControl.blur();
            endControl.blur();
          }}
        />
        <div className="relative h-4">
          {[0, 6, 12, 18, 24].map((h) => (
            <span
              key={h}
              className="absolute text-[10px] text-muted-foreground"
              style={{
                left: `${(h / 24) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {hoursToTime(h)}
            </span>
          ))}
        </div>
      </div>
      {(startField.errors || endField.errors) && (
        <p className="text-red-500">
          {startField.errors?.at(0) ?? endField.errors?.at(0)}
        </p>
      )}
    </div>
  );
}

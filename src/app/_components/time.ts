export const hoursToTime = (hours: number): string => {
  const h = Math.floor(hours).toString().padStart(2, "0");
  const m = hours % 1 === 0.5 ? "30" : "00";
  return `${h}:${m}`;
};

export const timeToHours = (time = ""): number => {
  if (!time || !time.includes(":")) return 0;
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
};

import { describe, expect, it } from "vitest";
import { hoursToTime, timeToHours } from "./time";

// hoursToTimeのテスト
describe("hoursToTimeのテスト", () => {
  it("10.5が10:30と変換されること", () => {
    const result = hoursToTime(10.5);
    expect(result).toBe("10:30");
  });
  // 0.5より大きいか小さいか1（境界値）
  it("10.6が10:00と変換されること", () => {
    const result = hoursToTime(10.6);
    expect(result).toBe("10:00");
  });
  // 0.5より大きいか小さいか2（境界値）
  it("10.15が10:00と変換されること", () => {
    const result = hoursToTime(10.15);
    expect(result).toBe("10:00");
  });
  // 例外
  it("-1が渡ったケース", () => {
    const result = hoursToTime(-1);
    expect(result).toBe("-1:00");
  });
});

// timeToHoursのテスト
describe("timeToHoursのテスト", () => {
  // テスト1: 10:00が10に変換されること;
  it("10:00が10に変換されること", () => {
    const result = timeToHours("10:00");
    expect(result).toBe(10);
  });
  // テスト2: 10:30が10.5に変換されること;
  it("10:30が10.5に変換されること", () => {
    const result = timeToHours("10:30");
    expect(result).toBe(10.5);
  });
  // テスト3: 10:15が10.25に変換されること;
  it("10:15が10.25に変換されること", () => {
    const result = timeToHours("10:15");
    expect(result).toBe(10.25);
  });
});

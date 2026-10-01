import { Section } from "./types";
export type Prediction = { minutesToFull: number | null; riskLevel: "low" | "medium" | "high"; percentFull: number };
export function predictSection(s: Section): Prediction {
  const remaining = s.capacity - s.enrolled;
  const percentFull = (s.enrolled / s.capacity) * 100;
  const perMin = s.joinRate / 15;
  const minutesToFull = perMin > 0 && remaining > 0 ? Math.round(remaining / perMin) : null;
  let riskLevel: Prediction["riskLevel"] = "low";
  if (remaining === 0 || percentFull >= 85 || (minutesToFull !== null && minutesToFull <= 30)) riskLevel = "high";
  else if (percentFull >= 60 || (minutesToFull !== null && minutesToFull <= 120)) riskLevel = "medium";
  return { minutesToFull, riskLevel, percentFull };
}
export function formatETA(m: number | null, full = false): string {
  if (full) return "مكتملة";
  if (m === null) return "غير متاح";
  if (m < 60) return `خلال ${m} دقيقة`;
  const h = Math.floor(m / 60), r = m % 60;
  return r === 0 ? `خلال ${h} ساعة` : `خلال ${h} ساعة و${r} دقيقة`;
}

import { Section } from "./types";
export function hasConflict(c: Section, schedule: Section[]) {
  return schedule.some((s) => s.day === c.day && !(c.endTime <= s.startTime || c.startTime >= s.endTime));
}
export function findAlternatives(target: Section, all: Section[], schedule: Section[]): Section[] {
  return all
    .filter((s) => s.courseCode === target.courseCode && s.id !== target.id)
    .filter((s) => s.enrolled < s.capacity * 0.85)
    .filter((s) => !hasConflict(s, schedule))
    .sort((a, b) => a.enrolled / a.capacity - b.enrolled / b.capacity);
}

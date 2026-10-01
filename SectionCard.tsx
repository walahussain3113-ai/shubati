"use client";
import { Section } from "@/lib/types";
import { predictSection, formatETA } from "@/lib/prediction";
export function SectionCard({ section, added, onAdd }: { section: Section; added: boolean; onAdd: () => void }) {
  const p = predictSection(section);
  const full = section.enrolled >= section.capacity;
  return (
    <div className="card" style={{ borderColor: `var(--${p.riskLevel})` }}>
      <h3>{section.courseName}</h3>
      <div className="meta">{section.courseCode}-{section.sectionNumber} | {section.instructor}</div>
      <div className="meta">📍 {section.day} | {section.startTime} – {section.endTime} | {section.room}</div>
      <div className="row"><span>{section.enrolled} / {section.capacity} مقعد</span><span className="meta">{Math.round(p.percentFull)}%</span></div>
      <div className="bar"><i style={{ width: `${p.percentFull}%`, background: `var(--${p.riskLevel})` }} /></div>
      <div className="row meta"><span>⚡ +{section.joinRate} / 15 دقيقة</span><span>⏳ {formatETA(p.minutesToFull, full)}</span></div>
      <button className="btn" disabled={added || full} onClick={onAdd}>{added ? "مضافة" : full ? "مكتملة" : "أضف للجدول"}</button>
    </div>
  );
}

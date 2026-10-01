"use client";
import { Section } from "@/lib/types";
export function AlternativeModal({ alternative, onConfirm, onCancel }: { alternative: Section; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="modal">
      <div className="box">
        <h2>الشعبة على وشك الإغلاق، تبي نحطّك في بديل؟</h2>
        <div className="pick">
          <b>{alternative.courseName}</b>
          <div className="meta">{alternative.courseCode}-{alternative.sectionNumber} | {alternative.instructor}</div>
          <div className="meta">📍 {alternative.day} | {alternative.startTime} – {alternative.endTime}</div>
          <div className="meta" style={{ color: "var(--low)" }}>✅ {alternative.capacity - alternative.enrolled} مقعد متاح</div>
        </div>
        <div className="btns">
          <button className="btn" onClick={onConfirm}>نعم، بدّلني</button>
          <button className="btn alt" onClick={onCancel}>لا، خلّني</button>
        </div>
      </div>
    </div>
  );
}

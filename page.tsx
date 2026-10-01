"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLiveSections } from "@/hooks/useLiveSections";
import { SectionCard } from "@/components/SectionCard";
import { AlternativeModal } from "@/components/AlternativeModal";
import { predictSection } from "@/lib/prediction";
import { hasConflict } from "@/lib/alternatives";
import { Section } from "@/lib/types";

export default function Home() {
  const { sections, connected } = useLiveSections();
  const [ids, setIds] = useState<string[]>([]);
  const [target, setTarget] = useState<Section | null>(null);
  const [alt, setAlt] = useState<Section | null>(null);

  useEffect(() => { try { setIds(JSON.parse(localStorage.getItem("shubati:schedule") || "[]")); } catch {} }, []);
  const save = (n: string[]) => { setIds(n); localStorage.setItem("shubati:schedule", JSON.stringify(n)); };
  const mine = sections.filter((s) => ids.includes(s.id));

  async function enroll(s: Section) {
    const r = await fetch("/api/enroll", { method: "POST", body: JSON.stringify({ sectionId: s.id }) });
    if (r.status === 409) { toast.error(`❌ ${s.courseCode}-${s.sectionNumber} اكتملت قبل ثوانٍ`); return; }
    save([...ids, s.id]);
    toast.success(`✅ تم حجز مقعدك في ${s.courseName}`);
  }
  async function drop(s: Section) {
    await fetch("/api/enroll", { method: "DELETE", body: JSON.stringify({ sectionId: s.id }) });
    save(ids.filter((i) => i !== s.id));
  }
  async function handleAdd(s: Section) {
    if (hasConflict(s, mine)) return toast.error("⚠️ تعارض مع شعبة في جدولك");
    if (mine.some((m) => m.courseCode === s.courseCode)) return toast.error("⚠️ سجّلت هذه المادة من قبل");
    if (predictSection(s).riskLevel === "high") {
      toast.error(`🚨 ${s.courseCode}-${s.sectionNumber} على وشك الإغلاق!`);
      const res = await fetch(`/api/alternatives?id=${s.id}&schedule=${ids.join(",")}`);
      const alts: Section[] = await res.json();
      if (alts.length) { setTarget(s); setAlt(alts[0]); return; }
    }
    await enroll(s);
  }

  return (
    <main className="wrap">
      <h1>🎓 شعبتي</h1>
      <p className="sub">اعرف قبل ما تقفل. <span className="live">{connected ? "● مباشر" : "○ إعادة اتصال..."}</span></p>
      <div className="grid">
        <div>
          <h2>الشعب المتاحة</h2>
          {sections.map((s) => (
            <SectionCard key={s.id} section={s} added={ids.includes(s.id)} onAdd={() => handleAdd(s)} />
          ))}
        </div>
        <div className="side">
          <h2>جدولك الحالي</h2>
          {mine.length === 0 ? <p className="empty">لم تضف أي شعبة بعد.</p> : mine.map((s) => (
            <div key={s.id} className="item" style={{ borderColor: s.color }}>
              <div><b>{s.courseName}</b><div className="meta">{s.day} | {s.startTime}</div></div>
              <button className="x" onClick={() => drop(s)}>×</button>
            </div>
          ))}
        </div>
      </div>
      {alt && target && (
        <AlternativeModal
          alternative={alt}
          onConfirm={async () => { await enroll(alt); setAlt(null); setTarget(null); }}
          onCancel={async () => { await enroll(target); setAlt(null); setTarget(null); }}
        />
      )}
    </main>
  );
}

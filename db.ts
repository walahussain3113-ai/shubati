import { PrismaClient } from "@prisma/client";
const g = globalThis as any;
export const prisma: PrismaClient = g.prisma ?? (g.prisma = new PrismaClient());

const seed = [
  ["CS101-03","CS101","مقدمة في البرمجة","03","د. سارة العتيبي","الأحد","10:00","11:30","مبنى 7 - قاعة 204",50,47,6,"#f59e0b"],
  ["CS101-07","CS101","مقدمة في البرمجة","07","د. خالد المطيري","الثلاثاء","10:00","11:30","مبنى 7 - قاعة 108",50,38,2,"#10b981"],
  ["PHYS101-05","PHYS101","الفيزياء العامة","05","د. نورة القحطاني","الأربعاء","13:00","14:30","مبنى 5 - قاعة 302",45,43,5,"#f59e0b"],
  ["PHYS101-07","PHYS101","الفيزياء العامة","07","د. سارة الدوسري","الأحد","10:00","11:30","مبنى 5 - قاعة 210",45,33,1,"#10b981"],
  ["MATH101-02","MATH101","التفاضل والتكامل","02","د. فهد الشمري","الاثنين","08:00","09:30","مبنى 3 - قاعة 101",60,41,3,"#2563eb"],
  ["MATH101-04","MATH101","التفاضل والتكامل","04","د. منى الحربي","الخميس","08:00","09:30","مبنى 3 - قاعة 105",60,30,2,"#2563eb"],
].map(([id,courseCode,courseName,sectionNumber,instructor,day,startTime,endTime,room,capacity,enrolled,joinRate,color]) =>
  ({ id,courseCode,courseName,sectionNumber,instructor,day,startTime,endTime,room,capacity,enrolled,joinRate,color } as any));

// SIMULATE=false لإيقاف المحاكي وتغذية القاعدة من نظام الجامعة
export function ready(): Promise<void> {
  if (g.shubatiReady) return g.shubatiReady;
  g.shubatiReady = (async () => {
    if ((await prisma.section.count()) === 0) await prisma.section.createMany({ data: seed });
    if (process.env.SIMULATE !== "false") {
      setInterval(async () => {
        const rows = await prisma.section.findMany();
        for (const s of rows)
          if (s.enrolled < s.capacity && Math.random() < 0.08 + s.joinRate * 0.05)
            await prisma.section.update({ where: { id: s.id }, data: { enrolled: { increment: 1 } } });
      }, 5000);
    }
  })();
  return g.shubatiReady;
}

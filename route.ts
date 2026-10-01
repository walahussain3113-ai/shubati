import { prisma, ready } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  await ready();
  const enc = new TextEncoder();
  let timer: ReturnType<typeof setInterval>;
  const stream = new ReadableStream({
    start(c) {
      const send = async () => {
        try {
          const rows = await prisma.section.findMany({ orderBy: { id: "asc" } });
          c.enqueue(enc.encode(`data: ${JSON.stringify(rows)}\n\n`));
        } catch {}
      };
      send();
      timer = setInterval(send, 3000);
    },
    cancel() { clearInterval(timer); },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}

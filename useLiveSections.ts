"use client";
import { useEffect, useState } from "react";
import { Section } from "@/lib/types";
export function useLiveSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const es = new EventSource("/api/stream");
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (e) => setSections(JSON.parse(e.data));
    return () => es.close();
  }, []);
  return { sections, connected };
}

"use client";

import { useEffect } from "react";

export default function RootNotFound() {
  useEffect(() => {
    const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    window.location.replace(`${prefix}/fr/`);
  }, []);

  return (
    <p className="px-6 py-16 text-center text-sm text-muted">Willo…</p>
  );
}

"use client";

import { useEffect, useState } from "react";

import type { SearchIndex } from "@/lib/search";

let cachedIndex: SearchIndex | null = null;
let pending: Promise<SearchIndex> | null = null;

function loadIndex() {
  if (cachedIndex) return Promise.resolve(cachedIndex);
  if (!pending) {
    pending = fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Search index unavailable (${response.status})`);
        return response.json() as Promise<SearchIndex>;
      })
      .then((index) => {
        cachedIndex = index;
        return index;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

export function useSearchIndex() {
  const [index, setIndex] = useState<SearchIndex | null>(cachedIndex);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!cachedIndex);

  useEffect(() => {
    let active = true;
    loadIndex()
      .then((data) => {
        if (active) {
          setIndex(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load search index");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return { index, error, loading };
}

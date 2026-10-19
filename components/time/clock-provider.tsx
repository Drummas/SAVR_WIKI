"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  SERVER_OFFSET,
  browserOffset,
  formatZoneDate,
  formatZoneDateShort,
  formatZoneDayLong,
  formatZoneTime,
  formatZoneWeekday,
  zoneDateKey,
  zoneLabel,
  type ClockMode,
} from "@/lib/time";

const MODE_KEY = "savr.clock.mode";
const OFFSET_KEY = "savr.clock.offset";

interface ClockContextValue {
  /** `server` = in-game UTC clock, `local` = the player's chosen offset. */
  mode: ClockMode;
  /** The player's saved offset (minutes east of UTC). */
  localOffset: number;
  /** Offset currently used for rendering (server or local). */
  offset: number;
  /** Short label for the active clock, e.g. `UTC` or `UTC+2`. */
  zone: string;
  /** Live timestamp, refreshed a few times a minute. Null until hydration. */
  nowMs: number | null;
  /** True once saved preferences have been read from storage. */
  ready: boolean;
  setMode: (mode: ClockMode) => void;
  setLocalOffset: (offset: number) => void;
  useBrowserOffset: () => void;
  formatTime: (value: string | number | Date) => string;
  formatDate: (value: string | number | Date) => string;
  formatDateShort: (value: string | number | Date) => string;
  formatDayLong: (value: string | number | Date) => string;
  formatWeekday: (value: string | number | Date) => string;
  dateKey: (value: string | number | Date) => string;
}

const ClockContext = createContext<ClockContextValue | null>(null);

export function ClockProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ClockMode>("server");
  const [localOffset, setLocalOffsetState] = useState<number>(browserOffset());
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const stored = useRef(false);

  useEffect(() => {
    try {
      const savedMode = window.localStorage.getItem(MODE_KEY);
      const savedOffset = window.localStorage.getItem(OFFSET_KEY);
      if (savedMode === "server" || savedMode === "local") setModeState(savedMode);
      if (savedOffset !== null) {
        const parsed = Number.parseInt(savedOffset, 10);
        if (Number.isFinite(parsed) && parsed >= -720 && parsed <= 840) {
          setLocalOffsetState(parsed);
        }
      }
    } catch {
      // Storage can be unavailable (private mode, blocked cookies): defaults stand.
    }
    stored.current = true;
    setNowMs(Date.now());
    setReady(true);

    const timer = window.setInterval(() => setNowMs(Date.now()), 20_000);

    function onStorage(event: StorageEvent) {
      if (event.key === MODE_KEY && (event.newValue === "server" || event.newValue === "local")) {
        setModeState(event.newValue);
      }
      if (event.key === OFFSET_KEY) {
        const parsed = Number.parseInt(event.newValue ?? "", 10);
        if (Number.isFinite(parsed)) setLocalOffsetState(parsed);
      }
    }
    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const persist = useCallback((key: string, value: string) => {
    if (!stored.current) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Preferences are a nicety; the session still works without persistence.
    }
  }, []);

  const setMode = useCallback(
    (next: ClockMode) => {
      setModeState(next);
      persist(MODE_KEY, next);
    },
    [persist],
  );

  const setLocalOffset = useCallback(
    (next: number) => {
      setLocalOffsetState(next);
      persist(OFFSET_KEY, String(next));
      if (next !== SERVER_OFFSET) {
        setModeState("local");
        persist(MODE_KEY, "local");
      }
    },
    [persist],
  );

  const useBrowserOffset = useCallback(() => {
    setLocalOffset(browserOffset());
  }, [setLocalOffset]);

  const offset = mode === "server" ? SERVER_OFFSET : localOffset;

  const value = useMemo<ClockContextValue>(
    () => ({
      mode,
      localOffset,
      offset,
      zone: zoneLabel(offset),
      nowMs,
      ready,
      setMode,
      setLocalOffset,
      useBrowserOffset,
      formatTime: (input) => formatZoneTime(input, offset),
      formatDate: (input) => formatZoneDate(input, offset),
      formatDateShort: (input) => formatZoneDateShort(input, offset),
      formatDayLong: (input) => formatZoneDayLong(input, offset),
      formatWeekday: (input) => formatZoneWeekday(input, offset),
      dateKey: (input) => zoneDateKey(input, offset),
    }),
    [mode, localOffset, offset, nowMs, ready, setMode, setLocalOffset, useBrowserOffset],
  );

  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
}

export function useClock() {
  const context = useContext(ClockContext);
  if (!context) {
    throw new Error("useClock must be used inside <ClockProvider>");
  }
  return context;
}

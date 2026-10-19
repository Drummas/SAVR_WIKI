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
  displayOffset,
  formatZoneDate,
  formatZoneDateShort,
  formatZoneDayLong,
  formatZoneTime,
  formatZoneWeekday,
  nowOnServerClock,
  zoneDateKey,
  zoneLabel,
  type ClockMode,
} from "@/lib/time";

const MODE_KEY = "savr.clock.mode";
const OFFSET_KEY = "savr.clock.offset";

interface ClockContextValue {
  /** `server` = in-game clock (UTC-5), `local` = the player's chosen offset. */
  mode: ClockMode;
  /** The player's saved offset (minutes east of UTC). */
  localOffset: number;
  /** Offset currently used for the clock (server or local). */
  offset: number;
  /**
   * Shift to apply to stored calendar values so they render in `offset`.
   * Zero in server mode, because the data is already on the server clock.
   */
  displayOffset: number;
  /** Short label for the active clock, e.g. `UTC-5` or `UTC+2`. */
  zone: string;
  /**
   * Live timestamp on the server clock, refreshed a few times a minute. Null
   * until hydration. In the same space as the stored calendar values.
   */
  nowMs: number | null;
  /** Calendar day key for today in the active clock, e.g. `2026-10-19`. */
  todayKey: string;
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
    setNowMs(nowOnServerClock());
    setReady(true);

    const timer = window.setInterval(() => setNowMs(nowOnServerClock()), 20_000);

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
      // Picking an offset by hand means "show me that clock", even when the
      // offset happens to match the server's UTC-5.
      setModeState("local");
      persist(MODE_KEY, "local");
    },
    [persist],
  );

  const useBrowserOffset = useCallback(() => {
    setLocalOffset(browserOffset());
  }, [setLocalOffset]);

  const offset = mode === "server" ? SERVER_OFFSET : localOffset;
  // Stored values are on the server clock, so every label needs the extra hop
  // out of that clock before the chosen zone is applied.
  const shift = displayOffset(offset);

  const value = useMemo<ClockContextValue>(
    () => ({
      mode,
      localOffset,
      offset,
      displayOffset: shift,
      zone: zoneLabel(offset),
      nowMs,
      todayKey: zoneDateKey(nowMs ?? nowOnServerClock(), shift),
      ready,
      setMode,
      setLocalOffset,
      useBrowserOffset,
      formatTime: (input) => formatZoneTime(input, shift),
      formatDate: (input) => formatZoneDate(input, shift),
      formatDateShort: (input) => formatZoneDateShort(input, shift),
      formatDayLong: (input) => formatZoneDayLong(input, shift),
      formatWeekday: (input) => formatZoneWeekday(input, shift),
      dateKey: (input) => zoneDateKey(input, shift),
    }),
    [mode, localOffset, offset, shift, nowMs, ready, setMode, setLocalOffset, useBrowserOffset],
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

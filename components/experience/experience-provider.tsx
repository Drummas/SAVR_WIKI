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
  DEFAULT_EXPERIENCE,
  EXPERIENCE_HINT_DURATION,
  EXPERIENCE_STORAGE_KEY,
  isExperienceId,
  type ExperienceId,
} from "@/lib/experience";

import { ExperienceChooser } from "./experience-chooser";
import { ExperienceCoachmark } from "./experience-coachmark";

interface ExperienceContextValue {
  /** Layout the visitor is reading. */
  experience: ExperienceId;
  /** Switch layouts from the header toggle. */
  setExperience: (next: ExperienceId) => void;
  /** Record a choice from the first-visit dialog and show the toggle hint. */
  chooseExperience: (next: ExperienceId) => void;
  /** The first-visit dialog is waiting for an answer. */
  chooserOpen: boolean;
  hintVisible: boolean;
  dismissHint: () => void;
}

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

/**
 * Paint the layout on <html>. The inline script in the root layout has already
 * written the saved value before first paint; this keeps later changes and
 * other tabs in step. CSS in `styles/globals.css` owns which sections show.
 */
function applyExperience(experience: ExperienceId) {
  document.documentElement.dataset.experience = experience;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experience, setExperienceState] = useState<ExperienceId>(DEFAULT_EXPERIENCE);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const hintTimer = useRef<number | null>(null);

  const clearHintTimer = useCallback(() => {
    if (hintTimer.current !== null) {
      window.clearTimeout(hintTimer.current);
      hintTimer.current = null;
    }
  }, []);

  const startHint = useCallback(() => {
    clearHintTimer();
    setHintVisible(true);
    hintTimer.current = window.setTimeout(() => {
      setHintVisible(false);
      hintTimer.current = null;
    }, EXPERIENCE_HINT_DURATION);
  }, [clearHintTimer]);

  const dismissHint = useCallback(() => {
    clearHintTimer();
    setHintVisible(false);
  }, [clearHintTimer]);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(EXPERIENCE_STORAGE_KEY);
    } catch {
      // Storage can be blocked; the default layout still renders.
    }

    if (isExperienceId(stored)) {
      setExperienceState(stored);
      applyExperience(stored);
    } else {
      // No saved choice yet: show the current (advanced) layout behind the
      // first-visit dialog rather than guessing on the visitor's behalf.
      setExperienceState(DEFAULT_EXPERIENCE);
      applyExperience(DEFAULT_EXPERIENCE);
      setChooserOpen(true);
    }

    function onStorage(event: StorageEvent) {
      if (event.key !== EXPERIENCE_STORAGE_KEY) return;
      if (!isExperienceId(event.newValue)) {
        setExperienceState(DEFAULT_EXPERIENCE);
        applyExperience(DEFAULT_EXPERIENCE);
        return;
      }
      setExperienceState(event.newValue);
      applyExperience(event.newValue);
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => clearHintTimer, [clearHintTimer]);

  const setExperience = useCallback((next: ExperienceId) => {
    setExperienceState(next);
    applyExperience(next);
    try {
      window.localStorage.setItem(EXPERIENCE_STORAGE_KEY, next);
    } catch {
      // A blocked store only costs the preference, not the current view.
    }
  }, []);

  const chooseExperience = useCallback(
    (next: ExperienceId) => {
      setExperience(next);
      setChooserOpen(false);
      startHint();
    },
    [setExperience, startHint],
  );

  const value = useMemo<ExperienceContextValue>(
    () => ({
      experience,
      setExperience,
      chooseExperience,
      chooserOpen,
      hintVisible,
      dismissHint,
    }),
    [experience, setExperience, chooseExperience, chooserOpen, hintVisible, dismissHint],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      <ExperienceChooser open={chooserOpen} onChoose={chooseExperience} />
      <ExperienceCoachmark visible={hintVisible} onDismiss={dismissHint} />
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used inside <ExperienceProvider>");
  }
  return context;
}

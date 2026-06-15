export type CallOutcome = "answered" | "ring" | "voicemail";

export interface CallEntry {
  id: string;
  startedAt: string;
  phone?: string;
  name?: string;
  outcome?: CallOutcome;
  note?: string;
}

export interface Settings {
  dailyGoal: number;
  secondTimezone: string;
}

export const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 30,
  secondTimezone: "Europe/Berlin",
};

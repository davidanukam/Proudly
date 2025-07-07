import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StreakData {
  current: number;
  longest: number;
  lastPostDate: string | null;
}

interface SettingsState {
  theme: "light" | "dark" | "system";
  streaks: StreakData;
  isFirstLaunch: boolean;
  updateTheme: (theme: "light" | "dark" | "system") => void;
  updateStreak: () => void;
  resetStreak: () => void;
  setFirstLaunchComplete: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "system",
      streaks: {
        current: 0,
        longest: 0,
        lastPostDate: null,
      },
      isFirstLaunch: true,

      updateTheme: (theme) => set({ theme }),

      updateStreak: () => {
        const { streaks } = get();
        const today = new Date().toDateString();

        // If already posted today, don't update streak
        if (streaks.lastPostDate === today) {
          return;
        }

        // Check if last post was yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        let newCurrent = 1; // Default to 1 if streak broken

        if (streaks.lastPostDate === yesterdayString) {
          // Continuing streak
          newCurrent = streaks.current + 1;
        }

        const newLongest = Math.max(newCurrent, streaks.longest);

        set({
          streaks: {
            current: newCurrent,
            longest: newLongest,
            lastPostDate: today,
          },
        });
      },

      resetStreak: () =>
        set({
          streaks: {
            current: 0,
            longest: get().streaks.longest, // Keep longest streak
            lastPostDate: null,
          },
        }),

      setFirstLaunchComplete: () => set({ isFirstLaunch: false }),
    }),
    {
      name: "proudly-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

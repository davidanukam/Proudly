import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entry, EntryFormData } from "@/types/entry";

interface EntriesState {
  entries: Entry[];
  addEntry: (entryData: EntryFormData) => void;
  updateEntry: (id: string, entryData: Partial<EntryFormData>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDate: (date: string) => Entry[];
  getEntriesForMonth: (year: number, month: number) => Record<string, Entry[]>;
  getOnThisDayEntries: (month: number, day: number) => Entry[];
}

export const useEntriesStore = create<EntriesState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entryData: EntryFormData) => {
        const newEntry: Entry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          text: entryData.text,
          media: entryData.media || [],
          tags: entryData.tags || [],
          isPrivate: entryData.isPrivate,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          entries: [newEntry, ...state.entries],
        }));
      },

      updateEntry: (id: string, entryData: Partial<EntryFormData>) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...entryData } : entry
          ),
        }));
      },

      deleteEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      getEntriesByDate: (date: string) => {
        const targetDate = new Date(date).toDateString();
        return get().entries.filter(
          (entry) => new Date(entry.date).toDateString() === targetDate
        );
      },

      getEntriesForMonth: (year: number, month: number) => {
        const entriesByDay: Record<string, Entry[]> = {};

        get().entries.forEach((entry) => {
          const entryDate = new Date(entry.date);
          if (
            entryDate.getFullYear() === year &&
            entryDate.getMonth() === month
          ) {
            const day = entryDate.getDate().toString();
            if (!entriesByDay[day]) {
              entriesByDay[day] = [];
            }
            entriesByDay[day].push(entry);
          }
        });

        return entriesByDay;
      },

      getOnThisDayEntries: (month: number, day: number) => {
        return get().entries.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate.getMonth() === month && entryDate.getDate() === day;
        });
      },
    }),
    {
      name: "proudly-entries",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

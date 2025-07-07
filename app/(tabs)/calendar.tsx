import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "@/constants/colors";
import CalendarView from "@/components/CalendarView";
import { useEntriesStore } from "@/store/useEntriesStore";
import EntryCard from "@/components/EntryCard";
import EmptyState from "@/components/EmptyState";
import { Calendar as CalendarIcon } from "lucide-react-native";

export default function CalendarScreen() {
  const { entries } = useEntriesStore();

  // Get today's entries
  const today = new Date();
  const todayString = today.toDateString();

  const todayEntries = entries.filter(
    (entry) => new Date(entry.date).toDateString() === todayString
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <CalendarView />

      <View style={styles.todayContainer}>
        <View style={styles.todayHeader}>
          <CalendarIcon size={20} color={colors.light.primary} />
          <Text style={styles.todayTitle}>Today</Text>
        </View>

        {todayEntries.length === 0 ? (
          <EmptyState
            title="No entries today"
            message="Add your first achievement for today by tapping the Add tab."
            icon={<CalendarIcon size={48} color={colors.light.subtext} />}
          />
        ) : (
          <View style={styles.entriesContainer}>
            {todayEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  todayContainer: {
    marginTop: 16,
  },
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    marginLeft: 8,
  },
  entriesContainer: {
    gap: 12,
  },
});

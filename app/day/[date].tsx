import EmptyState from "@/components/EmptyState";
import EntryCard from "@/components/EntryCard";
import { colors } from "@/constants/colors";
import { useEntriesStore } from "@/store/useEntriesStore";
import { formatDate } from "@/utils/dateUtils";
import { Stack, useLocalSearchParams } from "expo-router";
import { Calendar } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { getEntriesByDate } = useEntriesStore();

  const entries = getEntriesByDate(date);
  const formattedDate = formatDate(date);

  return (
    <>
      <Stack.Screen
        options={{
          title: formattedDate,
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={
          entries.length === 0 ? styles.emptyContainer : styles.contentContainer
        }
      >
        {entries.length === 0 ? (
          <EmptyState
            title="No entries on this day"
            message="You haven't added any moments for this day yet."
            icon={<Calendar size={48} color={colors.light.subtext} />}
          />
        ) : (
          <>
            <Text style={styles.dateHeader}>{formattedDate}</Text>

            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </>
        )}
      </ScrollView>
    </>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: 16,
  },
});

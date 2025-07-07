import EntryCard from "@/components/EntryCard";
import { colors } from "@/constants/colors";
import { useEntriesStore } from "@/store/useEntriesStore";
import { Clock } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function OnThisDay() {
  const today = new Date();
  const { getOnThisDayEntries } = useEntriesStore();

  const pastEntries = getOnThisDayEntries(
    today.getMonth(),
    today.getDate()
  ).filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate.getFullYear() < today.getFullYear();
  });

  if (pastEntries.length === 0) {
    return null;
  }

  // Group entries by year
  const entriesByYear: Record<string, typeof pastEntries> = {};

  pastEntries.forEach((entry) => {
    const year = new Date(entry.date).getFullYear().toString();
    entriesByYear[year] ??= [];
    entriesByYear[year].push(entry);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock size={20} color={colors.light.primary} />
        <Text style={styles.title}>On This Day</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {Object.entries(entriesByYear).map(([year, entries]) => (
          <View key={year} style={styles.yearContainer}>
            <Text style={styles.yearText}>{year}</Text>
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} compact />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    marginLeft: 8,
  },
  scrollContent: {
    paddingRight: 16,
  },
  yearContainer: {
    width: 280,
    marginRight: 16,
    backgroundColor: colors.light.highlight,
    borderRadius: 16,
    padding: 16,
  },
  yearText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.primary,
    marginBottom: 12,
  },
});

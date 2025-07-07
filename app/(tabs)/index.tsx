import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useEntriesStore } from "@/store/useEntriesStore";
import { colors } from "@/constants/colors";
import EntryCard from "@/components/EntryCard";
import EmptyState from "@/components/EmptyState";
import StreakCounter from "@/components/StreakCounter";
import OnThisDay from "@/components/OnThisDay";
import { formatDate } from "@/utils/dateUtils";
import { Smile } from "lucide-react-native";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const { entries } = useEntriesStore();

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Group entries by date
  const entriesByDate: Record<string, typeof entries> = {};

  sortedEntries.forEach((entry) => {
    const dateKey = new Date(entry.date).toDateString();
    entriesByDate[dateKey] ??= [];
    entriesByDate[dateKey].push(entry);
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        entries.length === 0 ? styles.emptyContainer : styles.contentContainer
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {entries.length === 0 ? (
        <EmptyState
          title="No moments yet"
          message="Start capturing moments you're proud of by adding your first entry."
          icon={<Smile size={48} color={colors.light.subtext} />}
        />
      ) : (
        <>
          <StreakCounter />

          <OnThisDay />

          <Text style={styles.sectionTitle}>Recent Moments</Text>

          {Object.entries(entriesByDate).map(([date, dateEntries]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{formatDate(date)}</Text>
              {dateEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </View>
          ))}
        </>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.subtext,
    marginBottom: 12,
  },
});

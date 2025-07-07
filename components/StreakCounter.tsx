import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { Flame } from "lucide-react-native";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function StreakCounter() {
  const { streaks } = useSettingsStore();

  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        <Flame size={20} color={colors.light.secondary} style={styles.icon} />
        <Text style={styles.streakText}>
          <Text style={styles.streakCount}>{streaks.current}</Text> day streak
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.bestContainer}>
        <Text style={styles.bestText}>
          Best: <Text style={styles.bestCount}>{streaks.longest}</Text> days
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  streakContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  streakText: {
    fontSize: 15,
    color: colors.light.text,
  },
  streakCount: {
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.light.border,
    marginHorizontal: 12,
  },
  bestContainer: {
    flex: 1,
  },
  bestText: {
    fontSize: 15,
    color: colors.light.subtext,
    textAlign: "right",
  },
  bestCount: {
    fontWeight: "bold",
    color: colors.light.text,
  },
});

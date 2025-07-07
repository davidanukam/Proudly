import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { colors } from "@/constants/colors";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useEntriesStore } from "@/store/useEntriesStore";
import {
  Moon,
  Sun,
  Trash2,
  Share,
  Info,
  Lock,
  Award,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const { theme, updateTheme, streaks, resetStreak } = useSettingsStore();
  const { entries } = useEntriesStore();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    updateTheme(newTheme);

    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
  };

  const handleResetStreak = () => {
    Alert.alert(
      "Reset Streak",
      "Are you sure you want to reset your current streak? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetStreak();

            if (Platform.OS !== "web") {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "This feature is coming soon!", [
      { text: "OK" },
    ]);
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      "Delete All Data",
      "Are you sure you want to delete all your entries? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Coming Soon",
              "This feature will be available in a future update."
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>

        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === "light" && styles.selectedThemeOption,
            ]}
            onPress={() => handleThemeChange("light")}
          >
            <Sun
              size={20}
              color={
                theme === "light" ? colors.light.primary : colors.light.text
              }
            />
            <Text
              style={[
                styles.themeText,
                theme === "light" && styles.selectedThemeText,
              ]}
            >
              Light
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === "dark" && styles.selectedThemeOption,
            ]}
            onPress={() => handleThemeChange("dark")}
          >
            <Moon
              size={20}
              color={
                theme === "dark" ? colors.light.primary : colors.light.text
              }
            />
            <Text
              style={[
                styles.themeText,
                theme === "dark" && styles.selectedThemeText,
              ]}
            >
              Dark
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.themeOption,
              theme === "system" && styles.selectedThemeOption,
            ]}
            onPress={() => handleThemeChange("system")}
          >
            <View style={styles.systemIcon}>
              <Sun
                size={14}
                color={
                  theme === "system" ? colors.light.primary : colors.light.text
                }
              />
              <Moon
                size={14}
                color={
                  theme === "system" ? colors.light.primary : colors.light.text
                }
              />
            </View>
            <Text
              style={[
                styles.themeText,
                theme === "system" && styles.selectedThemeText,
              ]}
            >
              System
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Award size={24} color={colors.light.primary} />
            <Text style={styles.statValue}>{entries.length}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Award size={24} color={colors.light.secondary} />
            <Text style={styles.statValue}>{streaks.current}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Award size={24} color={colors.light.accent} />
            <Text style={styles.statValue}>{streaks.longest}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleResetStreak}
        >
          <Text style={styles.actionButtonText}>Reset Current Streak</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
          <Share size={20} color={colors.light.text} />
          <Text style={styles.settingText}>Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, styles.dangerItem]}
          onPress={handleDeleteAllData}
        >
          <Trash2 size={20} color={colors.light.accent} />
          <Text style={[styles.settingText, styles.dangerText]}>
            Delete All Data
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.settingItem}>
          <Info size={20} color={colors.light.text} />
          <Text style={styles.settingText}>Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  section: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: colors.light.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: 16,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.light.background,
    marginHorizontal: 4,
  },
  selectedThemeOption: {
    backgroundColor: colors.light.highlight,
  },
  themeText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.light.text,
  },
  selectedThemeText: {
    color: colors.light.primary,
    fontWeight: "600",
  },
  systemIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.light.subtext,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.light.border,
  },
  actionButton: {
    backgroundColor: colors.light.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: colors.light.accent,
    fontWeight: "600",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  settingText: {
    fontSize: 16,
    color: colors.light.text,
    marginLeft: 12,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: colors.light.accent,
  },
});

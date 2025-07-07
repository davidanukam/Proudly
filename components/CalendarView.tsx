import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useEntriesStore } from "@/store/useEntriesStore";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarView() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<
    Array<{ date: number | null; month: "current" | "prev" | "next" }>
  >([]);

  const { getEntriesForMonth } = useEntriesStore();

  const entriesForMonth = getEntriesForMonth(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );

  useEffect(() => {
    generateCalendarDays();
  }, [selectedDate]);

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Last day of previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: Array<{
      date: number | null;
      month: "current" | "prev" | "next";
    }> = [];

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: prevMonthLastDay - i, month: "prev" });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ date: i, month: "current" });
    }

    // Next month days
    const remainingSlots = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ date: i, month: "next" });
    }

    setCalendarDays(days);
  };

  const goToPreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const handleDayPress = (day: number, month: "current" | "prev" | "next") => {
    let year = selectedDate.getFullYear();
    let monthIndex = selectedDate.getMonth();

    if (month === "prev") {
      monthIndex -= 1;
      if (monthIndex < 0) {
        monthIndex = 11;
        year -= 1;
      }
    } else if (month === "next") {
      monthIndex += 1;
      if (monthIndex > 11) {
        monthIndex = 0;
        year += 1;
      }
    }

    const date = new Date(year, monthIndex, day);
    router.push(`/day/${date.toISOString().split("T")[0]}`);
  };

  const isToday = (day: number, month: "current" | "prev" | "next") => {
    if (month !== "current") return false;

    const today = new Date();
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const hasEntries = (day: number, month: "current" | "prev" | "next") => {
    if (month !== "current") return false;
    return (
      !!entriesForMonth[day.toString()] &&
      entriesForMonth[day.toString()].length > 0
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <ChevronLeft size={24} color={colors.light.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToToday} style={styles.monthYearContainer}>
          <Text style={styles.monthYear}>
            {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <ChevronRight size={24} color={colors.light.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.daysHeader}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.dayName}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {calendarDays.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              item.month !== "current" && styles.otherMonthDay,
              isToday(item.date!, item.month) && styles.today,
            ]}
            onPress={() => handleDayPress(item.date!, item.month)}
            disabled={item.date === null}
          >
            <Text
              style={[
                styles.dayNumber,
                item.month !== "current" && styles.otherMonthDayText,
                isToday(item.date!, item.month) && styles.todayText,
              ]}
            >
              {item.date}
            </Text>

            {hasEntries(item.date!, item.month) && (
              <View style={styles.entryIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.background,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  navButton: {
    padding: 8,
  },
  monthYearContainer: {
    padding: 8,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.light.text,
  },
  daysHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  dayName: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: colors.light.subtext,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%", // 100% / 7
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dayNumber: {
    fontSize: 16,
    color: colors.light.text,
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  otherMonthDayText: {
    color: colors.light.subtext,
  },
  today: {
    backgroundColor: colors.light.highlight,
    borderRadius: 8,
  },
  todayText: {
    color: colors.light.primary,
    fontWeight: "bold",
  },
  entryIndicator: {
    position: "absolute",
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.primary,
  },
});

import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Entry } from "@/types/entry";
import { colors } from "@/constants/colors";
import { formatDate } from "@/utils/dateUtils";

interface EntryCardProps {
  entry: Entry;
  compact?: boolean;
}

export default function EntryCard({ entry, compact = false }: Readonly<EntryCardProps>) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/entry/${entry.id}`);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        compact ? styles.compactContainer : null,
        pressed ? styles.pressed : null,
      ]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(entry.date)}</Text>
      </View>

      <Text
        style={[styles.text, compact ? styles.compactText : null]}
        numberOfLines={compact ? 2 : 4}
      >
        {entry.text}
      </Text>

      {entry.media && entry.media.length > 0 && !compact && (
        <Image
          source={{ uri: entry.media[0] }}
          style={styles.media}
          resizeMode="cover"
        />
      )}

      {entry.tags && entry.tags.length > 0 && !compact && (
        <View style={styles.tagsContainer}>
          {entry.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  compactContainer: {
    padding: 12,
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: colors.light.subtext,
    fontWeight: "500",
  },
  text: {
    fontSize: 16,
    color: colors.light.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  compactText: {
    fontSize: 14,
    marginBottom: 4,
  },
  media: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  tag: {
    backgroundColor: colors.light.highlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: colors.light.primary,
    fontWeight: "500",
  },
});

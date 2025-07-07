import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";
import { useEntriesStore } from "@/store/useEntriesStore";
import { formatDateAndTime } from "@/utils/dateUtils";
import { Share2, Trash2, Edit } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { entries, deleteEntry } = useEntriesStore();

  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Entry not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteEntry(entry.id);

            if (Platform.OS !== "web") {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
            }

            router.back();
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${entry.text}\n\nShared from Proudly`,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share entry");
    }
  };

  const handleEdit = () => {
    Alert.alert(
      "Coming Soon",
      "Editing entries will be available in a future update."
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: formatDateAndTime(entry.date),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.headerButton}
              >
                <Share2 size={20} color={colors.light.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.headerButton}
              >
                <Trash2 size={20} color={colors.light.accent} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>{entry.text}</Text>

          {entry.media && entry.media.length > 0 && (
            <View style={styles.mediaContainer}>
              {entry.media.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.mediaImage}
                  contentFit="cover"
                />
              ))}
            </View>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {entry.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              Created on {formatDateAndTime(entry.createdAt)}
            </Text>
            {entry.isPrivate && (
              <Text style={styles.privateText}>Private Entry</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Edit size={20} color="white" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    padding: 16,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontSize: 18,
    color: colors.light.subtext,
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 16,
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    color: colors.light.text,
    marginBottom: 20,
  },
  mediaContainer: {
    marginBottom: 20,
  },
  mediaImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    backgroundColor: colors.light.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: colors.light.primary,
    fontSize: 14,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    paddingTop: 16,
  },
  metaText: {
    fontSize: 14,
    color: colors.light.subtext,
    marginBottom: 4,
  },
  privateText: {
    fontSize: 14,
    color: colors.light.accent,
    fontWeight: "500",
  },
  editButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

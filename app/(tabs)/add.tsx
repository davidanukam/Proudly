import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";
import Button from "@/components/Button";
import { useEntriesStore } from "@/store/useEntriesStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Camera, Image as ImageIcon, X, Tag } from "lucide-react-native";
import * as Haptics from "expo-haptics";

const PROMPTS = [
  "What made you smile today?",
  "What challenge did you overcome?",
  "What are you grateful for today?",
  "What did you learn today?",
  "What made you proud of yourself?",
  "How did you help someone today?",
  "What positive step did you take today?",
];

export default function AddScreen() {
  const router = useRouter();
  const { addEntry } = useEntriesStore();
  const { updateStreak } = useSettingsStore();

  const [text, setText] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * PROMPTS.length);
    return PROMPTS[randomIndex];
  };

  const [currentPrompt, setCurrentPrompt] = useState(getRandomPrompt());

  const handleAddImage = async () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMedia([...media, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }

    const newMedia = [...media];
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");

      if (Platform.OS !== "web") {
        Haptics.selectionAsync();
      }
    }
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);

    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      Alert.alert(
        "Missing Content",
        "Please add some text about your achievement."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      addEntry({
        text,
        media,
        tags,
        isPrivate,
      });

      // Update streak
      updateStreak();

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Reset form
      setText("");
      setMedia([]);
      setTags([]);
      setCurrentTag("");
      setIsPrivate(false);
      setCurrentPrompt(getRandomPrompt());

      // Navigate back to home
      router.push("/");
    } catch (error) {
      console.error("Error adding entry:", error);
      Alert.alert("Error", "Failed to save your entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewPrompt = () => {
    setCurrentPrompt(getRandomPrompt());

    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>{currentPrompt}</Text>
          <TouchableOpacity
            style={styles.newPromptButton}
            onPress={handleNewPrompt}
          >
            <Text style={styles.newPromptText}>New Prompt</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="What are you proud of today?"
          placeholderTextColor={colors.light.subtext}
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
        />

        {media.length > 0 && (
          <View style={styles.mediaContainer}>
            {media.map((uri, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri }} style={styles.mediaImage} />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddImage}
          >
            <ImageIcon size={20} color={colors.light.primary} />
            <Text style={styles.actionText}>Add Image</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          <View style={styles.tagsHeader}>
            <Tag size={16} color={colors.light.subtext} />
            <Text style={styles.tagsTitle}>Tags</Text>
          </View>

          <View style={styles.tagsList}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tagItem}
                onPress={() => handleRemoveTag(index)}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <X size={12} color={colors.light.primary} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag..."
              placeholderTextColor={colors.light.subtext}
              value={currentTag}
              onChangeText={setCurrentTag}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={handleAddTag}
              disabled={!currentTag.trim()}
            >
              <Text
                style={[
                  styles.addTagButtonText,
                  !currentTag.trim() && styles.addTagButtonTextDisabled,
                ]}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.submitContainer}>
          <Button
            title="Save Moment"
            onPress={handleSubmit}
            loading={isSubmitting}
            size="large"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  promptContainer: {
    backgroundColor: colors.light.highlight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  promptText: {
    fontSize: 16,
    color: colors.light.primary,
    fontWeight: "500",
    marginBottom: 8,
  },
  newPromptButton: {
    alignSelf: "flex-end",
  },
  newPromptText: {
    fontSize: 14,
    color: colors.light.primary,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: colors.light.card,
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    fontSize: 16,
    color: colors.light.text,
    marginBottom: 16,
  },
  mediaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  mediaItem: {
    width: "31%",
    aspectRatio: 1,
    marginRight: "3.5%",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  removeMediaButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  actionText: {
    marginLeft: 8,
    color: colors.light.primary,
    fontWeight: "500",
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tagsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
    marginLeft: 8,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: colors.light.primary,
    marginRight: 6,
    fontSize: 14,
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagInput: {
    flex: 1,
    backgroundColor: colors.light.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.light.text,
  },
  addTagButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addTagButtonText: {
    color: colors.light.primary,
    fontWeight: "600",
  },
  addTagButtonTextDisabled: {
    opacity: 0.5,
  },
  submitContainer: {
    marginTop: 16,
  },
});

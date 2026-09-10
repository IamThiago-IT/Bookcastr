import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Episode } from "../types/episode";

type Props = {
  episode: Episode | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onExpand: () => void;
};

export function MiniPlayer({ episode, isPlaying, onPlayPause, onExpand }: Props) {
  if (!episode) return null;

  return (
    <TouchableOpacity onPress={onExpand} activeOpacity={0.9} style={styles.container}>
      <Image source={{ uri: episode.thumbnail }} style={styles.artwork} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {episode.title}
        </Text>
        <Text numberOfLines={1} style={styles.members}>
          {episode.members}
        </Text>
      </View>
      <TouchableOpacity onPress={onPlayPause} style={styles.playBtn}>
        <Text style={styles.playText}>{isPlaying ? "⏸" : "▶︎"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    height: 64,
    backgroundColor: "#18181B",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#27272A",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  artwork: { width: 48, height: 48, borderRadius: 8 },
  textContainer: { flex: 1, marginLeft: 12 },
  title: { color: "#fff", fontWeight: "600", fontSize: 14 },
  members: { color: "#A1A1AA", fontSize: 12, marginTop: 2 },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },
  playText: { color: "#fff", fontSize: 16, marginLeft: 2 },
});

import { create } from "zustand";
import { Episode } from "../types/episode";

type PlayerState = {
  episodeList: Episode[];
  currentIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;

  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayer: () => void;

  hasNext: boolean;
  hasPrevious: boolean;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  episodeList: [],
  currentIndex: 0,
  isPlaying: false,
  isLooping: false,
  isShuffling: false,

  get hasNext() {
    const { episodeList, currentIndex, isShuffling } = get();
    return isShuffling || currentIndex + 1 < episodeList.length;
  },
  get hasPrevious() {
    return get().currentIndex > 0;
  },

  play: (episode) => set({ episodeList: [episode], currentIndex: 0, isPlaying: true }),

  playList: (list, index) => set({ episodeList: list, currentIndex: index, isPlaying: true }),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setPlayingState: (isPlaying) => set({ isPlaying }),

  playNext: () => {
    const { episodeList, currentIndex, isShuffling, isLooping } = get();
    if (isShuffling) {
      const nextRandom = Math.floor(Math.random() * episodeList.length);
      set({ currentIndex: nextRandom });
      return;
    }
    if (currentIndex + 1 < episodeList.length) {
      set({ currentIndex: currentIndex + 1 });
    } else if (isLooping) {
      set({ currentIndex: 0 });
    }
  },

  playPrevious: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) set({ currentIndex: currentIndex - 1 });
  },

  toggleLoop: () => set((s) => ({ isLooping: !s.isLooping })),
  toggleShuffle: () => set((s) => ({ isShuffling: !s.isShuffling })),
  clearPlayer: () => set({ episodeList: [], currentIndex: 0, isPlaying: false }),
}));

// Selectors helpers for derived state outside store
export const useCurrentEpisode = () => {
  const list = usePlayerStore((s) => s.episodeList);
  const index = usePlayerStore((s) => s.currentIndex);
  return list[index] ?? null;
};

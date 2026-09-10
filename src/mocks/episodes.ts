import { Episode } from "../types/episode";
import { convertDurationToTimeString } from "../lib/format";

const raw = [
  {
    id: "a-importancia-do-typescript",
    title: "A importância do TypeScript no Front-end",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
    members: "Diego Fernandes, João Pedro",
    published_at: "2024-03-15T08:00:00Z",
    file: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: 2843,
    },
    description:
      "<p>Neste episódio falamos sobre como o TypeScript mudou a forma de escrever React e Next.js, trazendo segurança e produtividade.</p>",
  },
  {
    id: "react-native-vs-flutter",
    title: "React Native vs Flutter: qual escolher em 2026?",
    thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600",
    members: "Thiago, Mayk Brito",
    published_at: "2024-03-12T08:00:00Z",
    file: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: 2130,
    },
    description: "<p>Comparação prática entre os dois maiores frameworks mobile cross-platform.</p>",
  },
  {
    id: "expo-sdk-53-novidades",
    title: "Expo SDK 53: expo-audio, new arch e EAS",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600",
    members: "Rodrigo, Bianca",
    published_at: "2024-03-10T08:00:00Z",
    file: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: 1895,
    },
    description: "<p>Tudo o que mudou no SDK 53 e como migrar de expo-av para expo-audio.</p>",
  },
  {
    id: "podcastr-mobile-ux",
    title: "UX de player mobile: Mini-player e Bottom Sheet",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600",
    members: "Jakeliny, Diego",
    published_at: "2024-03-08T08:00:00Z",
    file: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      duration: 2450,
    },
    description: "<p>Como construir um player estilo Spotify/Apple Music com gestos e animações fluidas.</p>",
  },
  {
    id: "zustand-vs-redux",
    title: "Zustand vs Redux Toolkit no mundo mobile",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
    members: "Filipe Deschamps, Dani",
    published_at: "2024-03-05T08:00:00Z",
    file: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      duration: 1670,
    },
    description: "<p>Por que Zustand tem sido a escolha favorita para estado global leve no React Native.</p>",
  },
];

export const episodesMock: Episode[] = raw.map((ep) => ({
  id: ep.id,
  title: ep.title,
  thumbnail: ep.thumbnail,
  members: ep.members,
  publishedAt: ep.published_at,
  duration: ep.file.duration,
  durationAsString: convertDurationToTimeString(ep.file.duration),
  url: ep.file.url,
  description: ep.description,
}));

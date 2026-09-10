export type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number; // seconds
  durationAsString: string;
  url: string;
  description: string;
};

export type EpisodeRaw = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  published_at: string;
  file: {
    url: string;
    duration: number;
  };
  description: string;
};

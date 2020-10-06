export type StoryInfo = {
  id: number;
  title: string;
  score: number;
  time: number;
  url: string;
  by: string;
};

export type Author = {
  id: string;
  karma: number;
};

export type StoryEntry = {
  storyInfo: Required<StoryInfo>;
  author: Required<Author>;
};

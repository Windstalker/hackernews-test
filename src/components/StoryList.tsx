import * as React from "react";
import { StoryEntry } from "../types/models";
import Story from "./Story";

type Props = {
  stories: StoryEntry[];
};

function StoryList({ stories }: Props) {
  return (
    <>
      {Array.from(stories)
        .sort((a, b) => a.storyInfo.score - b.storyInfo.score)
        .map((entry) => (
          <Story key={entry.storyInfo.id} entry={entry}></Story>
        ))}
    </>
  );
}

export default StoryList;

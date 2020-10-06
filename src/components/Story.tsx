import * as React from "react";
import { StoryEntry } from "../types/models";
import "./Story.scss";

type Props = {
  entry: StoryEntry;
};

export default (props: Props) => {
  const { author, storyInfo } = props.entry;
  const dateString = new Date(storyInfo.time * 1000).toLocaleString();

  return (
    <div className="article">
      <div className="article-heading">
        <h2>{storyInfo.title}</h2>
        <span className="score">{storyInfo.score}</span>
      </div>
      <div className="author">
        <span className="author-name">
          At {dateString} by {author.id}
        </span>{" "}
        <span className="karma">({author.karma})</span>
      </div>
      <span>Read: </span>
      <a href={storyInfo.url} rel="noopener noreferrer">
        {storyInfo.url}
      </a>
    </div>
  );
};

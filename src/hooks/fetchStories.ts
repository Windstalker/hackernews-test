import { useEffect, useState } from "react";
import ApiService from "../services/apiService";

import { Author, StoryEntry } from "../types/models";

export type FetchState = {
  result: StoryEntry[] | void;
  error: Error | void;
};

export function useFetchStories(apiService: ApiService): FetchState {
  const [result, setResult] = useState<StoryEntry[]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    async function fetchTopStories() {
      const topStoriesIds = await apiService.fetchTopStories();
      const storiesDetails = await Promise.all(
        topStoriesIds.map((storyId) => apiService.fetchStoryInfo(storyId))
      );
      const authorsIds = storiesDetails.reduce((result: string[], story) => {
        if (result.indexOf(story.by) < 0) {
          result.push(story.by);
        }

        return result;
      }, []);
      const authors = await Promise.all(
        authorsIds.map((id) => apiService.fetchAuthorInfo(id))
      ).then((authorsList) =>
        authorsList.reduce<{ [id: string]: Author }>((result, author) => {
          result[author.id] = author;
          return result;
        }, {})
      );

      return storiesDetails.map<StoryEntry>((story) => ({
        storyInfo: story,
        author: authors[story.by],
      }));
    }

    fetchTopStories().then(setResult, setError);
  }, [apiService]);

  return {
    result: result,
    error: error,
  };
}

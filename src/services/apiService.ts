import { Author, StoryInfo } from "../types/models";

class ApiService {
  static STATUS_OK = 200;
  static apiURL = "https://hacker-news.firebaseio.com/v0";
  static topStoriesURL = `${ApiService.apiURL}/topstories.json`;
  static itemURL = `${ApiService.apiURL}/item`;
  static authorURL = `${ApiService.apiURL}/user`;

  async _fetch(request: RequestInfo) {
    const response = await window.fetch(request);

    if (response.status === ApiService.STATUS_OK) {
      return await response.json();
    } else {
      throw Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }
  }

  async fetchTopStories(count: number = 10): Promise<number[]> {
    try {
      const data: number[] = await this._fetch(
        new Request(ApiService.topStoriesURL)
      );
      const randomStories: number[] = [];

      if (count >= data.length) {
        return data;
      }

      for (let i = 0; i < count; i++) {
        let randomIndex: number;

        do {
          randomIndex = Math.floor(Math.random() * data.length);
        } while (randomStories.indexOf(data[randomIndex]) > -1);

        randomStories.push(data[randomIndex]);
      }

      return randomStories;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async fetchStoryInfo(storyId: number): Promise<StoryInfo> {
    try {
      const data: StoryInfo = await this._fetch(
        new Request(`${ApiService.itemURL}/${storyId}.json`)
      );

      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async fetchAuthorInfo(authorId: string): Promise<Author> {
    try {
      const data: Author = await this._fetch(
        new Request(`${ApiService.authorURL}/${authorId}.json`)
      );

      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

export default ApiService;

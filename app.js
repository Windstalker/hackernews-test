(function () {
  class StoryEntry {
    constructor(storyInfo, author) {
      this.author = author;
      this.storyInfo = storyInfo;
    }
  }

  class ApiService {
    static STATUS_OK = 200;
    static apiURL = "https://hacker-news.firebaseio.com/v0";
    static topStoriesURL = `${ApiService.apiURL}/topstories.json`;
    static itemURL = `${ApiService.apiURL}/item`;
    static authorURL = `${ApiService.apiURL}/user`;

    async _fetch(request) {
      const response = await window.fetch(request);

      if (response.status === ApiService.STATUS_OK) {
        return await response.json();
      } else {
        throw Error(
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      }
    }

    async fetchTopStories(count = 10) {
      try {
        const data = await this._fetch(new Request(ApiService.topStoriesURL));
        const randomStories = [];

        if (count >= data.length) {
          return data;
        }

        for (var i = 0; i < count; i++) {
          var randomIndex = Math.floor(Math.random() * data.length);
          randomStories.push(data[randomIndex]);
        }

        return randomStories;
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    async fetchStoryInfo(storyId) {
      try {
        const data = await this._fetch(
          new Request(`${ApiService.itemURL}/${storyId}.json`)
        );

        return data;
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    async fetchAuthorInfo(authorId) {
      try {
        const data = await this._fetch(
          new Request(`${ApiService.authorURL}/${authorId}.json`)
        );

        return {
          id: data.id,
          karma: data.karma,
        };
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  }

  class HackerNewsApp {
    constructor() {
      this.apiService = new ApiService();
      this.storiesList = [];
      window.addEventListener("load", this.init);
    }

    init = () => {
      this.renderLoading();
      this.fetchTopStories()
        .then((storiesList) => {
          this.storiesList = storiesList;
          this.renderStories();
        })
        .catch((error) => this.renderError(error));
    };

    async fetchTopStories() {
      const topStoriesIds = await this.apiService.fetchTopStories();
      const storiesDetails = await Promise.all(
        topStoriesIds.map((storyId) => this.apiService.fetchStoryInfo(storyId))
      );
      const authorsIds = storiesDetails.reduce((result, story) => {
        if (result.indexOf(story.by) < 0) {
          result.push(story.by);
        }

        return result;
      }, []);
      const authors = await Promise.all(
        authorsIds.map((id) => this.apiService.fetchAuthorInfo(id))
      ).then((authorsList) =>
        authorsList.reduce((result, author) => {
          result[author.id] = author;
          return result;
        }, {})
      );

      return storiesDetails.map(
        (story) => new StoryEntry(story, authors[story.by])
      );
    }

    renderLoading() {
      // TODO: Implement loading render
    }

    renderStories() {
      // TODO: Implement stories render
      console.log(this.storiesList);
    }

    renderError(error) {
      // TODO: Implement render error
      console.error(error);
    }
  }

  new HackerNewsApp();
})();

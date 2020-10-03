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

  class ArticleView {
    constructor(entry) {
      this.entry = entry;
    }

    renderHeader() {
      var container = document.createElement("div");
      var header = document.createElement("h2");
      var score = document.createElement("span");

      header.innerText = this.entry.storyInfo.title;
      score.innerText = this.entry.storyInfo.score;
      score.className = "score";

      container.appendChild(header);
      container.appendChild(score);
      container.className = "article-heading";

      return container;
    }

    renderAuthor() {
      var container = document.createElement("div");
      var authorName = document.createElement("span");
      var karma = document.createElement("span");
      var time = new Date(this.entry.storyInfo.time * 1000);

      authorName.className = "author-name";
      karma.className = "karma";
      authorName.innerText = `At ${time.toLocaleString()} by ${
        this.entry.author.id
      }`;
      karma.innerText = `(${this.entry.author.karma})`;

      container.className = "author";
      container.appendChild(authorName);
      container.appendChild(document.createTextNode(" "));
      container.appendChild(karma);

      return container;
    }

    renderUrl() {
      var fragment = document.createDocumentFragment();
      var readSpan = document.createElement("span");
      var link = document.createElement("a");

      readSpan.innerText = "Read: ";
      link.href = this.entry.storyInfo.url;
      link.rel = "noopener noreferrer";
      link.innerText = this.entry.storyInfo.url;

      fragment.appendChild(readSpan);
      fragment.appendChild(link);

      return fragment;
    }

    render() {
      var articleEl = document.createElement("article");

      articleEl.className = "article";
      articleEl.appendChild(this.renderHeader());
      articleEl.appendChild(this.renderAuthor());
      articleEl.appendChild(this.renderUrl());

      return articleEl;
    }
  }

  class ArticleListView {
    constructor(entries) {
      this.entries = Array.from(entries).sort(
        (a, b) => a.storyInfo.score - b.storyInfo.score
      );
    }

    render() {
      var fragment = document.createDocumentFragment();

      this.entries.forEach((story) => {
        var articleView = new ArticleView(story);
        fragment.appendChild(articleView.render());
      });

      return fragment;
    }
  }

  class HackerNewsApp {
    constructor() {
      this.apiService = new ApiService();
      this.storiesList = [];
      window.addEventListener("load", this.init);
    }

    init = () => {
      this.initialRender();
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

    initialRender() {
      var header = document.createElement("h1");
      header.className = "main-header";
      header.innerText = "HackerNews";

      this.container = document.createElement("div");

      document.body.innerHTML = "";
      document.body.appendChild(header);
      document.body.appendChild(this.container);
    }

    clear() {
      this.container.childNodes.forEach((node) =>
        this.container.removeChild(node)
      );
    }

    renderLoading() {
      if (!this.loader) {
        var loader = document.createElement("h2");
        loader.className = "loading";
        loader.innerText = "Loading...";
        this.loader = loader;
      }

      this.clear();
      this.container.appendChild(this.loader);
    }

    renderStories() {
      // TODO: Implement stories render
      this.clear();
      console.log(this.storiesList);
      this.container.appendChild(
        new ArticleListView(this.storiesList).render()
      );
    }

    renderError(error) {
      console.error(error);

      if (!this.errorText) {
        this.errorText = document.createElement("span");
        this.errorText.className = "error";
      }

      this.errorText.innerText =
        "Unable to show articles, something wrong happened";

      this.clear();
      this.container.appendChild(this.errorText);
    }
  }

  return new HackerNewsApp();
})();

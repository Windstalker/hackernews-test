import React from "react";
import "./App.css";

import ErrorText from "./components/ErrorText";
import Loading from "./components/Loading";
import StoryList from "./components/StoryList";
import { useFetchStories } from "./hooks/fetchStories";
import ApiService from "./services/apiService";

type Props = {
  apiService: ApiService;
};

function App({ apiService }: Props) {
  const result = useFetchStories(apiService);
  const loading = !result.result && !result.error;
  return (
    <div className="App">
      <h1 className="App-header">HackerNews</h1>
      {loading ? <Loading /> : null}
      {result.error ? <ErrorText error={result.error} /> : null}
      {result.result ? <StoryList stories={result.result} /> : null}
    </div>
  );
}

export default App;

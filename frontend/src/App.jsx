import { Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";

import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import MovieDetails from "./pages/MovieDetails";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/search-results"
          element={<SearchResults />}
        />

        <Route
          path="/movie/:id"
          element={<MovieDetails />}
        />
      </Route>
    </Routes>
  );
}

export default App;
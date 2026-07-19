import { Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import MovieDetails from "./pages/MovieDetails";
import Theaters from "./pages/Theaters";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/theaters" element={<Theaters />} />
      </Route>
    </Routes>
  );
}

export default App;
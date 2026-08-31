import { Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import MovieDetails from "./pages/MovieDetails";
import Theaters from "./pages/Theaters";
import TheaterSearchResults from "./pages/TheaterSearchResults";

import Login from "./features/auth/Login";
import ProtectedRoute from "./features/auth/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Login page - without Navbar */}
      <Route path="/login" element={<Login />} />

      {/* All website pages require login */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/theaters" element={<Theaters />} />
        <Route
          path="/theaters/results"
          element={<TheaterSearchResults />}
        />
      </Route>

    </Routes>
  );
}

export default App;
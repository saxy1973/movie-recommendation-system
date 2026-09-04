import { Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import MovieDetails from "./pages/MovieDetails";
import Theaters from "./pages/Theaters";
import TheaterSearchResults from "./pages/TheaterSearchResults";

import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import ProtectedRoute from "./features/auth/ProtectedRoute";

import Wishlist from "./pages/Wishlist";


function App() {
  return (
    <Routes>

      {/* Login page - without Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

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
        <Route path="/wishlist" element={<Wishlist />} />
              
        

        <Route
          path="/theaters/results"
          element={<TheaterSearchResults />}
        />
        
      </Route>

    </Routes>
  );
}

export default App;
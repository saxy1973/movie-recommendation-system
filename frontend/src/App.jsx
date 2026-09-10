import { Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import MovieDetails from "./pages/MovieDetails";
import Theaters from "./pages/Theaters";
import TheaterSearchResults from "./pages/TheaterSearchResults";
import Recommendation from "./features/recommendations/Recommendations";
import Contact from "./features/contact/Contact";

import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import ProtectedRoute from "./features/auth/ProtectedRoute";

import Wishlist from "./pages/Wishlist";

// Account pages
import Account from "./features/account/Account";
import PersonalInformation from "./features/account/PersonalInformation";
import MyReviews from "./features/account/MyReviews";
import RecentlyViewed from "./features/account/RecentlyViewed";
import MyPreferences from "./features/account/MyPreferences";



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
        <Route path="/account" element={<Account />} />        
        <Route path="/theaters/results" element={<TheaterSearchResults />}/>
        <Route path="/account" element={<Account />}/>
        <Route path="/account/PersonalInformation" element={<PersonalInformation />}/>
        <Route path="/account/MyReviews" element={<MyReviews />}/>
        <Route path="/account/RecentlyViewed" element={<RecentlyViewed />}/>
        <Route path="/account/MyPreferences" element={<MyPreferences />}/>
        <Route path="/recommendations" element={<Recommendation />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

    </Routes>
  );
}

export default App;
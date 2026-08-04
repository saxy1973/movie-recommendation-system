import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = ({
  setLoading,
  setError,
}) => {

  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const searchCity = async () => {

    if (!city.trim()) return;

    try {

      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5000/api/theaters/city?city=${city}`
      );

      navigate("/theaters/results", {
        state: {
          theaters: res.data.theaters,
          city: city,
        },
      });

    } catch (err) {

      setError("City not found");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="search-container">

      <Search
        size={20}
        onClick={searchCity}
        style={{ cursor: "pointer" }}
      />

      <input
        type="text"
        placeholder="Search City"
        className="search-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchCity();
          }
        }}
      />

    </div>
  );
};

export default SearchBar;
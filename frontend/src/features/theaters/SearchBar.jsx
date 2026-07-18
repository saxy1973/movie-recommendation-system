import { Search } from "lucide-react";
const SearchBar = () => {
  return (
    <div className="search-container">
  <Search />

  <input
    type="text"
    placeholder="Search City"
    className="search-input"
  />
</div>
  );
};

export default SearchBar;
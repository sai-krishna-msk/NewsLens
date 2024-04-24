import React, { useState } from "react";
import SearchBar from "./searchBar";
import SearchResultList from "./searchResultList";
import "../App.css";

function SearchComponent() {
  const [results, setResults] = useState([]);

  return (
    <>
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        <SearchResultList results={results} />
      </div>
    </>
  );
}

export default SearchComponent;

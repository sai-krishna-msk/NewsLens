import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./searchBar.css";
import data from "/public/tokens_dict.json";

const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);

  // Fetching data from json
  const fetchData = (value) => {
    const results = [];
    const sentimentData = data;
    const keys = Object.keys(sentimentData);

    keys.forEach((word) => {
      // Check if the word contains the search value
      if (word.toLowerCase().includes(value.toLowerCase())) {
        // If the word matches, log it
        results.push({
          word: word,
          ...sentimentData[word],
        });
      }
    });
    setResults(results);
    console.log(results);
  };

  //  const handleSelect = (word) => {
  //    setSelectedWord(word);
  //  };

  const handleChange = (value) => {
    setInput(value);
    if (value === "") {
      setResults([]);
    }
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Search here"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

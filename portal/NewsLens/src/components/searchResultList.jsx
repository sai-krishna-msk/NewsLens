import React from "react";
import "./searchResultList.css";
import SearchResult from "./searchResult";

export const SearchResultList = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result, idx) => {
        return (
          <SearchResult key={idx} result={result.word} data={result} id={idx} />
        );
      })}
    </div>
  );
};

export default SearchResultList;

import React, { useState } from "react";
import "./searchResult.css";

export const SearchResult = ({ result, data }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleClick = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="search-result" onClick={handleClick}>
      {result}
      {showDetails && (
        <div className="details">
          <div className="tab-like-container">
          <p class="tab-blue">Neutral: {data.neutral || 0}</p>
          <p class="tab-green">Positive: {data.positive || 0}</p>
          <p class="tab-red">Negative: {data.negative || 0}</p>
          </div>
          <div>
            <p>Media Source:</p>
            <ul>
              {Object.keys(data.media_source).map((source, index) => (
                <li className="tab-like-container" key={index}>
                  {source}: <p class="tab-blue">Neutral: {data.media_source[source].neutral || 0}</p> <p class="tab-green">Positive:{" "}
                  {data.media_source[source].positive || 0}</p> <p class="tab-red">Negative: {data.media_source[source].negative || 0}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;

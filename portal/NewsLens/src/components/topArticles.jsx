import React, { useState, useEffect } from "react";
import RecommendedCard from "./RecommendedCard"; // Import the RecommendedCard component
import "./topArticles.css"; // Import your custom CSS file
import "../App.css";
import jsonData from "/public/frontend-processed-article-full_final.json"; // Import your JSON file
import { Link } from "react-router-dom";

function TopArticles() {
  const [mediaSources, setMediaSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedRecommendation, setClickedRecommendation] = useState(null);

  useEffect(() => {
    // Simulate fetching data locally by setting the state after a delay
    const timeout = setTimeout(() => {
      setMediaSources(jsonData);
      setLoading(false);
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleRecommendationClick = (detail) => {
    setClickedRecommendation(detail);
  };

  const renderData = () => {
    return mediaSources.slice(0, 10).map((source, index) => {
      // Accessing the recommended URL indexes
      const recommendedUrlIndexes = source.recommended_hashes;
      console.log(recommendedUrlIndexes);

      // Set to store unique recommended URLs
      const uniqueRecommendedUrls = new Set();

      // Array to store details for each recommended URL
      const recommendedDetails = [];

      // Loop through each index to get the corresponding URL and its details
      for (let i = 0; i < recommendedUrlIndexes.length; i++) {
        const currentIndex = recommendedUrlIndexes[i];
        if (currentIndex >= 0 && currentIndex < mediaSources.length) {
          const recommendedUrl = mediaSources[currentIndex]?.url;
          const recommendedHeadline = mediaSources[currentIndex]?.headline;
          const recommendedDescription =
            mediaSources[currentIndex]?.description;
          if (recommendedUrl && recommendedUrl !== "Not available") {
            uniqueRecommendedUrls.add(recommendedUrl);
            recommendedDetails.push({
              url: recommendedUrl,
              headline: recommendedHeadline,
              description: recommendedDescription,
            });
          }
        }
      }

      return (
        <div className="main-container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <li key={index} className="article-container">
              {/* <div
              className="article-tab"
              style={{ backgroundColor: source.tabColor }}
            ></div> */}
              <div className="card-body">
                <div className="img-container">
                  <img src={source.image_url} />
                </div>
                <div className="card-body-content">
                  <div className="card-body-content-text">
                    <h4 style={{ fontWeight: "600", textAlign: "left" }}>
                      {source.headline}
                    </h4>
                    <p>{source.description}</p>
                  </div>
                  <div className="card-body-content-button">
                    <button className="button-34">
                      <Link
                        style={{ color: "white", textDecoration: "None" }}
                        to={`/article/${source.id}`}
                      >
                        More Info
                      </Link>
                    </button>
                  </div>

                  {/* img headline description url{" "} */}
                  <br />
                  {/* <a href = "">recommended article</a> */}
                  {/* <RecommendedCard /> */}
                </div>
              </div>
              {/* <div className="card mb-3" style={{ maxWidth: "540px" }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={source.image_url}
                  className="img-fluid rounded-start"
                  alt="..."
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{source.headline}</h5>
                  <p className="card-text">{source.description}</p>
                  <p className="card-text">
                    <small className="text-body-secondary">
                      <button
                        onClick={() =>
                          handleRecommendationClick(recommendedDetails[index])
                        }
                        className="btn btn-link"
                      >
                        View Recommendations
                      </button>
                    </small>
                  </p>
                  <div className="card-content">
                    <p>Labels: {source.labels}</p>
                    <p>Scores: {source.scores}</p>
                    {/* Recommended details will be rendered conditionally */}
              {/* </div>
                </div>
              </div>
            </div>
          // </div> */}
            </li>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="article-main-container">
      <h1>Our Recommendations</h1>
      <ul className="top-articles-container">{renderData()}</ul>
      {/* Render the recommended card if a recommendation is clicked */}
      {clickedRecommendation && (
        <RecommendedCard
          url={clickedRecommendation.url}
          headline={clickedRecommendation.headline}
          description={clickedRecommendation.description}
        />
      )}
    </div>
  );
}

export default TopArticles;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsonData from "/public/frontend-processed-article-full_final.json";
import "./Article.css";
import { Link } from "react-router-dom";

function Article() {
  const { id } = useParams();
  const [mediaSources, setMediaSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data locally by setting the state after a delay
        const timeout = setTimeout(() => {
          setMediaSources(jsonData);
          setLoading(false);
        }, 1000); // Adjust the delay as needed

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]); // Re-run effect when id changes

  const article = mediaSources.find((article) => article.id === parseInt(id));

  // Function to get recommended articles
  const getRecommendedArticles = () => {
    if (article && article.recommended_hashes) {
      return article.recommended_hashes.map((id) =>
        mediaSources.find((article) => article.id === id)
      );
    }
    return [];
  };

  const recommendedArticles = getRecommendedArticles();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Function to determine the color based on label value
  const getColor = (label) => {
    switch (label) {
      case 'positive':
        return 'green';
      case 'negative':
        return 'red';
      case 'neutral':
        return 'blue';
      default:
        return 'black'; // default color
    }
  };

  return (
    <div>
      <div>
        <h3>Information about the Articles</h3>
        <h4><b>Headline:</b> {article.headline}</h4>
        <p><b>Words: </b>
          <span>{article.words.map((word, index) => (
            <span key={index}>
              <tab>{word} <span className="label-score"/></tab>
            </span>
          ))}</span>
        <p><button className="button-34"> <a className = "a-text" href = {article.url} >View Article</a></button></p></p>
      </div>

      <div className="articles-container">
        <h3>Recommended Articles:</h3>
        <div className="recommended-articles-container">
          {recommendedArticles.map((article, index) => (
            <div key={index} className="recommended-article-card">
              <img src = {article.image_url} />
              <h4><b>Headline:</b> {article.headline}</h4>
              <p><b>Media Source:</b> {article.media_source}</p>
              <p><b>Description:</b> {article.description}</p>
              <p><b>Label's Scores:</b></p>
              <span>
                {article.label_score.map((label, index) => (
                  <span key={index}>
                    {label[0]}: <span className="label-score" style={{ color: getColor(label[0]) }}>{label[1]}</span>
                  </span>
                ))}
              </span>
              <div className = "button-container">
              <button className="button-34">
                      <Link
                        style={{ color: "white", textDecoration: "None" }}
                        to={`/article/${article.id}`}
                      >
                        View Recommendations
                      </Link>
                    </button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Article;

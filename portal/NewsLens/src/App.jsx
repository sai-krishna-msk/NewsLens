import React from "react";
import NavBar from "./components/navBar";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import SearchResult from "./components/searchResult";
import TopArticles from "./components/topArticles";
import SearchComponent from "./components/SearchComponent";
import Article from "./components/Article";
// import RecomArticles from "./components/RecArticles";
function App() {
  return (
    <Router>
      <NavBar />
      <div className="main-container">
        <h1 className="title">NewsLens</h1>
        <Routes>
          <Route exact path="/" element={<SearchComponent />} />
          <Route path="/features" element={<TopArticles />} />
          <Route path="/article/:id" element={<Article />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

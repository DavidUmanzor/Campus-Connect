import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import InputSearch from "./components/InputSearch";
import HomePage from "./components/HomePage";
import MainPage from './components/MainPage'; // Ensure that this is the correct path
import SearchResults from './components/SearchResults'; // Update the path as necessary

function App() {
  return (
    <Router>
      <nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/searchresults" element={<SearchResults />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

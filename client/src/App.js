import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import HomePage from "./components/pages/HomePage";
import MainPage from './components/pages/MainPage';
import SearchResults from './components/pages/SearchResults';
import UserPage from './components/pages/UserPage';
import UniversityPage from './components/pages/UniversityPage';
import RsoPage from './components/pages/RsoPage';
import EventPage from './components/pages/EventPage';

function App() {
  return (
    <Router>
      <nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/searchresults" element={<SearchResults />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="university/:universityId" element={<UniversityPage />} />
        <Route path="rso/:rsoId" element={<RsoPage />} />
        <Route path="event/:eventId" element={<EventPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

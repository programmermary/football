import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Feild from './components/Feild';
import CardPage from './components/CardPage';
import React from 'react';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Feild />} />
        <Route path="/card" element={<CardPage />} />
      </Routes>
    </Router>
  );
}

export default App;

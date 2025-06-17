import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import FileUpload from './FileUpload';
import LinkManager from './LinkManager';
import PhotoGallery from './PhotoGallery';
import Reminder from './Reminder';
import Footer from './Footer';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/files" element={<FileUpload />} />
            <Route path="/links" element={<LinkManager />} />
            <Route path="/photos" element={<PhotoGallery />} />
            <Route path="/reminders" element={<Reminder />} />
            <Route path="/" element={
              <div className="welcome">
                <h1>BE THE BEST VERSION OF YOU</h1>
                <p>Store your files, links, photos, and set reminders all in one place!</p>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
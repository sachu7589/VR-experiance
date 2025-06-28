import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadAndView from './components/UploadAndView';
import ModelViewer from './components/ModelViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <h1>3D Walkthrough</h1>
            <UploadAndView />
          </div>
        } />
        <Route path="/viewer" element={<ModelViewer />} />
      </Routes>
    </Router>
  );
}

export default App;

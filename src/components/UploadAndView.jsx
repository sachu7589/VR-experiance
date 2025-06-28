import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModel } from './ModelContext';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function UploadAndView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setModelFile } = useModel();
  const [fileSelected, setFileSelected] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(false);
    setError(null);
    setModelFile(file);
    setFileSelected(true);
  };

  const handleViewModel = () => {
    navigate('/viewer');
  };

  return (
    <div style={{ padding: '20px' }}>
      <input type="file" accept=".glb,.gltf" onChange={handleFile} />
      {loading && <p>Loading model...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {fileSelected && (
        <button 
          onClick={handleViewModel}
          style={{ margin: '10px 0', padding: '10px 20px' }}
        >
          View 3D Model
        </button>
      )}
    </div>
  );
}

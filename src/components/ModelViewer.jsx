import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useModel } from './ModelContext';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Model({ model }) {
  const scene = useRef();
  return model ? (
    <primitive ref={scene} object={model.scene} />
  ) : null;
}

export default function ModelViewer() {
  const navigate = useNavigate();
  const { modelFile } = useModel();
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!modelFile) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      const loader = new GLTFLoader();
      loader.parse(arrayBuffer, '', (gltf) => {
        setModel(gltf);
      }, () => {
        setError('Failed to load model');
      });
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsArrayBuffer(modelFile);
  }, [modelFile]);

  if (!modelFile) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>No model found</h2>
        <button onClick={() => navigate('/')}>Go back to upload</button>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{error}</h2>
        <button onClick={() => navigate('/')}>Go back to upload</button>
      </div>
    );
  }

  if (!model) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#fff', background: '#000', height: '100vh' }}>
        <h2>Loading model...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%', 
      height: '100%', 
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '10px 20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Back to Upload
      </button>
      <Canvas 
        camera={{ position: [2, 2, 2], fov: 75 }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%', 
          height: '100%',
          display: 'block',
          margin: 0,
          padding: 0
        }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} />
        <Model model={model} />
        <Environment preset="sunset" />
        <OrbitControls />
      </Canvas>
    </div>
  );
} 
import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useModel } from './ModelContext';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

function Model({ model }) {
  const scene = useRef();
  return model ? (
    <primitive ref={scene} object={model.scene} />
  ) : null;
}

function CameraController({ cameraRef }) {
  const moveSpeed = 0.1;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!cameraRef.current) return;
      
      const camera = cameraRef.current;
      const direction = new THREE.Vector3();
      let leftVector, rightVector;
      
      switch(event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          // Move forward in camera direction
          camera.getWorldDirection(direction);
          camera.position.add(direction.multiplyScalar(moveSpeed));
          break;
        case 's':
        case 'arrowdown':
          // Move backward opposite to camera direction
          camera.getWorldDirection(direction);
          camera.position.add(direction.multiplyScalar(-moveSpeed));
          break;
        case 'a':
        case 'arrowleft': {
          // Move left perpendicular to camera direction
          camera.getWorldDirection(direction);
          leftVector = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
          camera.position.add(leftVector.multiplyScalar(moveSpeed));
          break;
        }
        case 'd':
        case 'arrowright': {
          // Move right perpendicular to camera direction
          camera.getWorldDirection(direction);
          rightVector = new THREE.Vector3(direction.z, 0, -direction.x).normalize();
          camera.position.add(rightVector.multiplyScalar(moveSpeed));
          break;
        }
        case 'q':
          // Move up in world space
          camera.position.y += moveSpeed;
          break;
        case 'e':
          // Move down in world space
          camera.position.y -= moveSpeed;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cameraRef]);

  return null;
}

export default function ModelViewer() {
  const navigate = useNavigate();
  const { modelFile } = useModel();
  const [model, setModel] = useState(null);
  const [error, setError] = useState(null);
  const cameraRef = useRef();

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
      
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        padding: '10px 20px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <div>WASD / Arrow Keys: Move</div>
        <div>Q/E: Up/Down</div>
        <div>Mouse: Rotate/Zoom</div>
      </div>

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
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} />
        <Model model={model} />
        <Environment preset="sunset" />
        <OrbitControls />
        <CameraController cameraRef={cameraRef} />
      </Canvas>
    </div>
  );
} 
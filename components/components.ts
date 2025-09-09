import React, { Suspense, useCallback, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html, Text } from '@react-three/drei'
import { create } from 'zustand'
import * as THREE from 'three'

// Components
const FileUpload: React.FC = () => {
  const { loadModel } = useModelLoader()
  const { isLoading, error } = useSceneStore()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      loadModel(file)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Import 3D Model</h2>
      <div className="mb-4">
        <input
          type="file"
          accept=".glb"
          onChange={handleFileChange}
          disabled={isLoading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      {isLoading && (
        <div className="text-blue-600 text-sm">Loading model...</div>
      )}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
      )}
    </div>
  )
}

const HotspotMarker: React.FC<{
  hotspot: Hotspot
  isSelected: boolean
  onClick: () => void
}> = ({ hotspot, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group position={[hotspot.position.x, hotspot.position.y, hotspot.position.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        scale={isSelected ? 0.15 : 0.1}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color={isSelected ? '#ff6b6b' : '#4ecdc4'} 
          emissive={isSelected ? '#ff3333' : '#2aa198'}
          emissiveIntensity={0.3}
        />
      </mesh>
      <Html distanceFactor={10} position={[0, 1.5, 0]}>
        <div className={`bg-white px-2 py-1 rounded shadow-lg text-xs font-medium transition-all ${
          isSelected ? 'bg-red-100 border-red-300' : 'bg-gray-100 border-gray-300'
        } border`}>
          {hotspot.label}
        </div>
      </Html>
    </group>
  )
}

const Model: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url)
  const { setModel, setLoading, setError } = useSceneStore()
  
  React.useEffect(() => {
    if (scene) {
      setModel(scene)
      setLoading(false)
    }
  }, [scene, setModel, setLoading])

  React.useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }
  }, [url])

  return <primitive object={scene} />
}

const SceneInteraction: React.FC = () => {
  const { camera, raycaster, pointer } = useThree()
  const { model, addHotspot } = useSceneStore()

  const handleDoubleClick = useCallback((event: MouseEvent) => {
    if (!model) return

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(model, true)
    
    if (intersects.length > 0) {
      const point = intersects[0].point
      const hotspot: Hotspot = {
        id: crypto.randomUUID(),
        position: { x: point.x, y: point.y, z: point.z },
        label: `Hotspot ${Date.now().toString().slice(-4)}`,
      }
      addHotspot(hotspot)
    }
  }, [model, addHotspot, camera, raycaster, pointer])

  React.useEffect(() => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('dblclick', handleDoubleClick)
      return () => canvas.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [handleDoubleClick])

  return null
}

const Scene: React.FC = () => {
  const { modelUrl, hotspots, selectedHotspot, selectHotspot } = useSceneStore()

  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 45 }}
      className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-300"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {modelUrl && (
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
      )}
      
      {hotspots.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          isSelected={selectedHotspot === hotspot.id}
          onClick={() => selectHotspot(hotspot.id)}
        />
      ))}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={50}
      />
      
      <SceneInteraction />
      
      <gridHelper args={[20, 20, '#666', '#888']} />
    </Canvas>
  )
}

const HotspotPanel: React.FC = () => {
  const { hotspots, selectedHotspot, removeHotspot, selectHotspot } = useSceneStore()

  if (hotspots.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Hotspots</h3>
        <p className="text-gray-500 text-sm">
          Double-click on the 3D model to create hotspots
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Hotspots ({hotspots.length})
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedHotspot === hotspot.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => selectHotspot(hotspot.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-sm text-gray-800">
                  {hotspot.label}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Position: ({hotspot.position.x.toFixed(2)}, {hotspot.position.y.toFixed(2)}, {hotspot.position.z.toFixed(2)})
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeHotspot(hotspot.id)
                }}
                className="text-red-500 hover:text-red-700 text-xs ml-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const SwiftXR3DEditor: React.FC = () => {
  const { modelUrl, isLoading } = useSceneStore()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SwiftXR 3D Editor
          </h1>
          <p className="text-gray-600">
            Import GLB models, explore in 3D, and add interactive hotspots
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <FileUpload />
            <HotspotPanel />
            
            {modelUrl && (
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="text-sm font-semibold mb-2 text-gray-800">
                  Controls
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Mouse wheel: Zoom</li>
                  <li>• Left click + drag: Rotate</li>
                  <li>• Right click + drag: Pan</li>
                  <li>• Double click: Add hotspot</li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-[600px] relative">
                {!modelUrl && !isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Model Loaded
                      </h3>
                      <p className="text-gray-500">
                        Upload a .glb file to start exploring
                      </p>
                    </div>
                  </div>
                )}
                
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="animate-spin text-4xl mb-4">⚙️</div>
                      <p className="text-gray-600">Loading 3D model...</p>
                    </div>
                  </div>
                )}
                
                <Scene />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwiftXR3DEditor
import * as React from 'react'
import { useSceneStore } from './store/sceneStore'
import { FileUpload } from './components/FileUpload'
import { HotspotPanel } from './components/HotspotPanel'
import { Scene } from './components/Scene'

const App: React.FC = () => {
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
                  <li>• Click hotspot: Select</li>
                  <li>• Click label: Edit</li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-[600px] relative" data-testid="scene-container">
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
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50" data-testid="loading">
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

export default App
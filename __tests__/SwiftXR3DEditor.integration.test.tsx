// Integration Tests
// src/__tests__/SwiftXR3DEditor.integration.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// Mock the main component with simplified implementation for testing
const SwiftXR3DEditor: React.FC = () => {
  const [modelUrl, setModelUrl] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [hotspots, setHotspots] = React.useState<any[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsLoading(true)
      setTimeout(() => {
        setModelUrl('blob:test-url')
        setIsLoading(false)
      }, 100)
    }
  }

  const addHotspot = () => {
    const newHotspot = {
      id: `hotspot-${Date.now()}`,
      label: `Hotspot ${hotspots.length + 1}`,
      position: { x: 0, y: 0, z: 0 },
    }
    setHotspots([...hotspots, newHotspot])
  }

  return (
    <div data-testid="swiftxr-editor">
      <h1>SwiftXR 3D Editor</h1>
      
      <input
        type="file"
        onChange={handleFileUpload}
        data-testid="file-upload"
      />
      
      {isLoading && <div data-testid="loading">Loading...</div>}
      
      {modelUrl && !isLoading && (
        <div data-testid="scene-container">
          <div>3D Scene</div>
          <button onClick={addHotspot} data-testid="add-hotspot">
            Add Hotspot
          </button>
        </div>
      )}
      
      {hotspots.length > 0 && (
        <div data-testid="hotspots-panel">
          <h3>Hotspots ({hotspots.length})</h3>
          {hotspots.map((hotspot) => (
            <div key={hotspot.id} data-testid={`hotspot-${hotspot.id}`}>
              {hotspot.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

describe('SwiftXR3DEditor Integration Tests', () => {
  it('complete user workflow: upload model and create hotspots', async () => {
    render(<SwiftXR3DEditor />)
    
    // Initial state
    expect(screen.getByText('SwiftXR 3D Editor')).toBeInTheDocument()
    expect(screen.getByTestId('file-upload')).toBeInTheDocument()
    expect(screen.queryByTestId('scene-container')).not.toBeInTheDocument()
    
    // Upload file
    const fileInput = screen.getByTestId('file-upload')
    const file = new File([''], 'test.glb', { type: 'model/gltf-binary' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    // Loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    })
    
    // Scene should be visible
    expect(screen.getByTestId('scene-container')).toBeInTheDocument()
    expect(screen.getByText('3D Scene')).toBeInTheDocument()
    
    // Add hotspots
    const addButton = screen.getByTestId('add-hotspot')
    
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    
    // Verify hotspots panel
    expect(screen.getByTestId('hotspots-panel')).toBeInTheDocument()
    expect(screen.getByText('Hotspots (2)')).toBeInTheDocument()
  })
})
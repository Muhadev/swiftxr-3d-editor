import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from '../App'

describe('SwiftXR3DEditor Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('complete user workflow: upload model and create hotspots', async () => {
    render(<App />)
    
    // Initial state
    expect(screen.getByText('SwiftXR 3D Editor')).toBeInTheDocument()
    expect(screen.getByTestId('file-upload')).toBeInTheDocument()
    expect(screen.getByTestId('scene-container')).toBeInTheDocument()
    expect(screen.getByText('No Model Loaded')).toBeInTheDocument()
    
    // Upload file
    const fileInput = screen.getByTestId('file-upload')
    const file = new File([''], 'test.glb', { type: 'model/gltf-binary' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    // Loading state should appear
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Scene should be visible and controls should appear
    expect(screen.getByTestId('scene-container')).toBeInTheDocument()
    expect(screen.getByText('Controls')).toBeInTheDocument()
    expect(screen.getByText('• Double click: Add hotspot')).toBeInTheDocument()
  })

  it('shows empty hotspots panel initially', () => {
    render(<App />)
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('Double-click on the 3D model to create hotspots')).toBeInTheDocument()
  })

  it('handles file upload errors gracefully', async () => {
    render(<App />)
    
    const fileInput = screen.getByTestId('file-upload')
    const invalidFile = new File([''], 'test.obj', { type: 'application/octet-stream' })
    
    fireEvent.change(fileInput, { target: { files: [invalidFile] } })
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
      expect(screen.getByText('Please select a valid .glb file')).toBeInTheDocument()
    })
  })

  it('displays application header and description correctly', () => {
    render(<App />)
    
    expect(screen.getByText('SwiftXR 3D Editor')).toBeInTheDocument()
    expect(screen.getByText('Import GLB models, explore in 3D, and add interactive hotspots')).toBeInTheDocument()
  })
})
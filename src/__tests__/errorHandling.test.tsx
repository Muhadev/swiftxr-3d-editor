import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle file reading errors gracefully', async () => {
    const mockSetError = vi.fn()
    
    // Mock FileReader to throw error
    const originalFileReader = global.FileReader
    global.FileReader = class {
      readAsDataURL() {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror(new Event('error'))
          }
        }, 0)
      }
      onerror: ((event: Event) => void) | null = null
      onload: ((event: Event) => void) | null = null
    } as any

    const reader = new FileReader()
    reader.onerror = () => mockSetError('File reading failed')
    reader.readAsDataURL(new File([''], 'test.glb'))
    
    await new Promise(resolve => setTimeout(resolve, 10))
    
    expect(mockSetError).toHaveBeenCalledWith('File reading failed')
    
    // Restore original FileReader
    global.FileReader = originalFileReader
  })

  it('should handle invalid GLB file format', () => {
    const mockSetError = vi.fn()
    
    const validateFile = (file: File) => {
      if (!file.name.toLowerCase().endsWith('.glb')) {
        mockSetError('Please select a valid .glb file')
        return false
      }
      return true
    }
    
    const invalidFile = new File([''], 'test.obj', { type: 'application/octet-stream' })
    const validFile = new File([''], 'test.glb', { type: 'model/gltf-binary' })
    
    expect(validateFile(invalidFile)).toBe(false)
    expect(mockSetError).toHaveBeenCalledWith('Please select a valid .glb file')
    
    mockSetError.mockClear()
    
    expect(validateFile(validFile)).toBe(true)
    expect(mockSetError).not.toHaveBeenCalled()
  })

  it('should handle URL.createObjectURL errors', () => {
    const mockSetError = vi.fn()
    
    // Mock URL.createObjectURL to throw
    const originalCreateObjectURL = global.URL.createObjectURL
    global.URL.createObjectURL = vi.fn().mockImplementation(() => {
      throw new Error('Failed to create object URL')
    })
    
    const handleFileLoad = (file: File) => {
      try {
        URL.createObjectURL(file)
      } catch (error) {
        mockSetError(error instanceof Error ? error.message : 'Unknown error')
      }
    }
    
    const file = new File([''], 'test.glb', { type: 'model/gltf-binary' })
    handleFileLoad(file)
    
    expect(mockSetError).toHaveBeenCalledWith('Failed to create object URL')
    
    // Restore original function
    global.URL.createObjectURL = originalCreateObjectURL
  })
})
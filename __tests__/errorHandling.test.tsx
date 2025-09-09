// Error Handling Tests
// src/__tests__/errorHandling.test.tsx
describe('Error Handling', () => {
  it('should handle file reading errors gracefully', () => {
    // Mock FileReader to throw error
    const originalFileReader = window.FileReader
    window.FileReader = class {
      readAsDataURL() {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror(new Event('error'))
          }
        }, 0)
      }
    } as any

    const mockSetError = vi.fn()
    
    // Simulate file reading error
    const reader = new FileReader()
    reader.onerror = () => mockSetError('File reading failed')
    reader.readAsDataURL(new File([''], 'test.glb'))
    
    setTimeout(() => {
      expect(mockSetError).toHaveBeenCalledWith('File reading failed')
    }, 10)
    
    // Restore original FileReader
    window.FileReader = originalFileReader
  })

  it('should handle invalid GLB file format', () => {
    const mockSetError = vi.fn()
    
    const validateFile = (file: File) => {
      if (!file.name.toLowerCase().endsWith('.glb')) {
        mockSetError('Invalid file format')
        return false
      }
      return true
    }
    
    const invalidFile = new File([''], 'test.obj', { type: 'application/octet-stream' })
    const validFile = new File([''], 'test.glb', { type: 'model/gltf-binary' })
    
    expect(validateFile(invalidFile)).toBe(false)
    expect(mockSetError).toHaveBeenCalledWith('Invalid file format')
    
    mockSetError.mockClear()
    
    expect(validateFile(validFile)).toBe(true)
    expect(mockSetError).not.toHaveBeenCalled()
  })
})
import { useCallback } from 'react'
import { useSceneStore } from '../store/sceneStore'

export const useModelLoader = () => {
  const { setModelUrl, setLoading, setError, clearScene } = useSceneStore()

  const loadModel = useCallback(async (file: File) => {
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.glb')) {
      setError('Please select a valid .glb file')
      return
    }

    // Clear previous scene
    clearScene()
    setLoading(true)
    setError(null)
    
    try {
      const url = URL.createObjectURL(file)
      setModelUrl(url)
    } catch (error) {
      let errorMessage = 'Failed to load model'
      if (error instanceof Error) {
        if (error.message.includes('Legacy binary file')) {
          errorMessage = 'This GLB file uses an older format (glTF 1.0). Please use a glTF 2.0 file.'
        } else {
          errorMessage = error.message
        }
      }
      setError(errorMessage)
      setLoading(false)
    }
  }, [setModelUrl, setLoading, setError, clearScene])

  return { loadModel }
}
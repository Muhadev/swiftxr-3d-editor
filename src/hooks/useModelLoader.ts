import { useCallback } from 'react'
import { useSceneStore } from '../../store/sceneStore'

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
      setLoading(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load model'
      setError(errorMessage)
      setLoading(false)
    }
  }, [setModelUrl, setLoading, setError, clearScene])

  return { loadModel }
}
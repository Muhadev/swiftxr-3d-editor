import { useCallback } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { useSceneStore } from '@/store/sceneStore'

export const useModelLoader = () => {
  const { setModel, setLoading, setError } = useSceneStore()

  const loadModel = useCallback(async (file: File) => {
    setLoading(true)
    setError(null)
    
    try {
      const url = URL.createObjectURL(file)
      const gltf = await new Promise((resolve, reject) => {
        const loader = new GLTFLoader()
        loader.load(url, resolve, undefined, reject)
      })
      
      setModel(gltf.scene)
      URL.revokeObjectURL(url)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load model')
    } finally {
      setLoading(false)
    }
  }, [setModel, setLoading, setError])

  return { loadModel }
}
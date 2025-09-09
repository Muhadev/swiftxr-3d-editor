import * as React from 'react'
import { useGLTF } from '@react-three/drei'
import { useSceneStore } from '../../store/sceneStore'

interface ModelProps {
  url: string
}

export const Model: React.FC<ModelProps> = ({ url }) => {
  const { scene } = useGLTF(url)
  const { setModel, setLoading } = useSceneStore()
  
  React.useEffect(() => {
    if (scene) {
      setModel(scene)
      setLoading(false)
    }
  }, [scene, setModel, setLoading])

  React.useEffect(() => {
    return () => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    }
  }, [url])

  return <primitive object={scene} />
}
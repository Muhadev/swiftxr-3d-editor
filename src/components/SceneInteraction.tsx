import { useCallback, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useSceneStore } from '../store/sceneStore'
import { useHotspots } from '../hooks/useHotspots'

export const SceneInteraction = () => {
  const { camera, raycaster, pointer } = useThree()
  const { model } = useSceneStore()
  const { createHotspot } = useHotspots()

  const handleDoubleClick = useCallback((event: MouseEvent) => {
    if (!model) return

    // Prevent default behavior
    event.preventDefault()
    
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(model, true)
    
    if (intersects.length > 0) {
      const point = intersects[0].point
      createHotspot({
        x: point.x,
        y: point.y,
        z: point.z
      })
    }
  }, [model, createHotspot, camera, raycaster, pointer])

  useEffect(() => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('dblclick', handleDoubleClick)
      return () => canvas.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [handleDoubleClick])

  return null
}
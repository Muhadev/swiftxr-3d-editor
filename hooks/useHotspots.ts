import { useCallback } from 'react'
import { Vector3 } from 'three'
import { useSceneStore } from '@/store/sceneStore'
import type { Vector3D } from '@/types'
import * as THREE from 'three'

export const useHotspots = () => {
  const { hotspots, addHotspot, removeHotspot, updateHotspot, selectHotspot } = useSceneStore()

  const createHotspot = useCallback((position: Vector3D, label: string) => {
    const hotspot = {
      id: crypto.randomUUID(),
      position,
      label,
    }
    addHotspot(hotspot)
  }, [addHotspot])

  const handleHotspotClick = useCallback((position: Vector3, camera: THREE.Camera) => {
    const screenPosition = position.clone().project(camera)
    return {
      x: (screenPosition.x * 0.5 + 0.5) * window.innerWidth,
      y: (screenPosition.y * -0.5 + 0.5) * window.innerHeight,
    }
  }, [])

  return {
    hotspots,
    createHotspot,
    removeHotspot,
    updateHotspot,
    selectHotspot,
    handleHotspotClick,
  }
}
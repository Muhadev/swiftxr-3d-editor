import { useCallback } from 'react'
import { Vector3 } from 'three'
import { useSceneStore } from '../store/sceneStore'
import type { Vector3D, Hotspot } from '../types'
import * as THREE from 'three'

export const useHotspots = () => {
  const { 
    hotspots, 
    selectedHotspot, 
    addHotspot, 
    removeHotspot, 
    updateHotspot, 
    selectHotspot 
  } = useSceneStore()

  const createHotspot = useCallback((position: Vector3D, label?: string) => {
    const hotspot: Hotspot = {
      id: crypto.randomUUID(),
      position,
      label: label || `Hotspot ${hotspots.length + 1}`,
    }
    addHotspot(hotspot)
    return hotspot
  }, [addHotspot, hotspots.length])

  const getScreenPosition = useCallback((position: Vector3, camera: THREE.Camera): { x: number; y: number } => {
    const screenPosition = position.clone().project(camera)
    return {
      x: (screenPosition.x * 0.5 + 0.5) * window.innerWidth,
      y: (screenPosition.y * -0.5 + 0.5) * window.innerHeight,
    }
  }, [])

  const editHotspotLabel = useCallback((id: string, newLabel: string) => {
    updateHotspot(id, { label: newLabel })
  }, [updateHotspot])

  return {
    hotspots,
    selectedHotspot,
    createHotspot,
    removeHotspot,
    updateHotspot,
    selectHotspot,
    editHotspotLabel,
    getScreenPosition,
  }
}
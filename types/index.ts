import * as THREE from 'three'


export interface Vector3D {
  x: number
  y: number
  z: number
}

export interface Hotspot {
  id: string
  position: Vector3D
  label: string
  description?: string
}

export interface SceneState {
  model: THREE.Object3D | null
  hotspots: Hotspot[]
  selectedHotspot: string | null
  isLoading: boolean
  error: string | null
  modelUrl: string | null
}

export interface CameraControls {
  enablePan: boolean
  enableZoom: boolean
  enableRotate: boolean
}
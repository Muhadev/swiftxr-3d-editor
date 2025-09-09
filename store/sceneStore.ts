import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SceneState, Hotspot } from '@/types'
import * as THREE from 'three'

interface SceneActions {
  setModel: (model: THREE.Object3D | null) => void
  addHotspot: (hotspot: Hotspot) => void
  removeHotspot: (id: string) => void
  updateHotspot: (id: string, updates: Partial<Hotspot>) => void
  selectHotspot: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setModelUrl: (url: string | null) => void
}

export const useSceneStore = create<SceneState & SceneActions>()(
  devtools(
    (set, get) => ({
      model: null,
      hotspots: [],
      selectedHotspot: null,
      isLoading: false,
      error: null,
      modelUrl: null,
      
      setModel: (model) => set({ model }),
      addHotspot: (hotspot) => set((state) => ({
        hotspots: [...state.hotspots, hotspot]
      })),
      removeHotspot: (id) => set((state) => ({
        hotspots: state.hotspots.filter((h) => h.id !== id)
      })),
      updateHotspot: (id, updates) => set((state) => ({
        hotspots: state.hotspots.map((h) => 
          h.id === id ? { ...h, ...updates } : h
        )
      })),
      selectHotspot: (id) => set({ selectedHotspot: id }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setModelUrl: (modelUrl) => set({ modelUrl }),
    }),
    { name: 'scene-store' }
  )
)
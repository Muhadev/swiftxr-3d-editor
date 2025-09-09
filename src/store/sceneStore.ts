import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { SceneState, Hotspot } from '../types'
import * as THREE from 'three'

interface SceneActions {
  setModel: (model: THREE.Object3D | null) => void
  setModelUrl: (url: string | null) => void
  addHotspot: (hotspot: Hotspot) => void
  removeHotspot: (id: string) => void
  updateHotspot: (id: string, updates: Partial<Hotspot>) => void
  selectHotspot: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearScene: () => void
}

export const useSceneStore = create<SceneState & SceneActions>()(
  devtools(
    (set) => ({
      // State
      model: null,
      hotspots: [],
      selectedHotspot: null,
      isLoading: false,
      error: null,
      modelUrl: null,
      
      // Actions
      setModel: (model) => set({ model }),
      
      setModelUrl: (modelUrl) => set({ modelUrl }),
      
      addHotspot: (hotspot) => set((state) => ({
        hotspots: [...state.hotspots, hotspot],
        selectedHotspot: hotspot.id
      })),
      
      removeHotspot: (id) => set((state) => ({
        hotspots: state.hotspots.filter((h) => h.id !== id),
        selectedHotspot: state.selectedHotspot === id ? null : state.selectedHotspot
      })),
      
      updateHotspot: (id, updates) => set((state) => ({
        hotspots: state.hotspots.map((h) => 
          h.id === id ? { ...h, ...updates } : h
        )
      })),
      
      selectHotspot: (id) => set({ selectedHotspot: id }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearScene: () => set({
        model: null,
        hotspots: [],
        selectedHotspot: null,
        modelUrl: null,
        error: null
      })
    }),
    { name: 'scene-store' }
  )
)
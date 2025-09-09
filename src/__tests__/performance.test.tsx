// Performance Tests
// src/__tests__/performance.test.tsx
import { describe, it, expect, vi } from 'vitest'
import type { Hotspot } from '../types'

describe('Performance Tests', () => {
  it('should handle large number of hotspots efficiently', () => {
    const startTime = performance.now()
    
    // Simulate creating 1000 hotspots
    const hotspots = Array.from({ length: 1000 }, (_, i) => ({
      id: `hotspot-${i}`,
      label: `Hotspot ${i}`,
      position: { x: i, y: i, z: i },
    }))
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    // Should complete within reasonable time (< 100ms)
    expect(duration).toBeLessThan(100)
    expect(hotspots).toHaveLength(1000)
  })

  it('should efficiently filter hotspots by selection', () => {
    const hotspots = Array.from({ length: 10000 }, (_, i) => ({
      id: `hotspot-${i}`,
      selected: i % 100 === 0, // Every 100th hotspot is selected
    }))
    
    const startTime = performance.now()
    const selectedHotspots = hotspots.filter(h => h.selected)
    const endTime = performance.now()
    
    expect(selectedHotspots).toHaveLength(100)
    expect(endTime - startTime).toBeLessThan(50)
  })
})
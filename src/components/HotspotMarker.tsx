import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { HotspotMarkerProps } from '../types'

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({ 
  hotspot, 
  isSelected, 
  onClick 
}) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group position={[hotspot.position.x, hotspot.position.y, hotspot.position.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        scale={isSelected ? 0.15 : 0.1}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial 
          color={isSelected ? '#ff6b6b' : '#4ecdc4'} 
          emissive={isSelected ? '#ff3333' : '#2aa198'}
          emissiveIntensity={0.3}
        />
      </mesh>
      <Html distanceFactor={10} position={[0, 1.5, 0]}>
        <div 
          className={`bg-white px-2 py-1 rounded shadow-lg text-xs font-medium transition-all border pointer-events-none ${
            isSelected ? 'bg-red-100 border-red-300' : 'bg-gray-100 border-gray-300'
          }`}
          data-testid="hotspot-label"
        >
          {hotspot.label}
        </div>
      </Html>
    </group>
  )
}
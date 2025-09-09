import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useSceneStore } from '../../store/sceneStore'
import { useHotspots } from '../hooks/useHotspots'
import { Model } from './Model'
import { HotspotMarker } from './HotspotMarker'
import { SceneInteraction } from './SceneInteraction'

export const Scene: React.FC = () => {
  const { modelUrl } = useSceneStore()
  const { hotspots, selectedHotspot, selectHotspot } = useHotspots()

  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 45 }}
      className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-300"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {modelUrl && (
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
      )}
      
      {hotspots.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          isSelected={selectedHotspot === hotspot.id}
          onClick={() => selectHotspot(hotspot.id)}
        />
      ))}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={50}
      />
      
      <SceneInteraction />
      
      <gridHelper args={[20, 20, '#666', '#888']} />
    </Canvas>
  )
}
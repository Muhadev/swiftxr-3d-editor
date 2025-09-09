// src/test/setup.ts
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Mock Three.js for testing
vi.mock('three', () => ({
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas'),
  })),
  Scene: vi.fn(() => ({
    add: vi.fn(),
    remove: vi.fn(),
  })),
  PerspectiveCamera: vi.fn(),
  Vector3: vi.fn(() => ({
    x: 0,
    y: 0,
    z: 0,
    clone: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    project: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    toFixed: vi.fn(() => '0.00'),
  })),
  Mesh: vi.fn(),
  SphereGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  Raycaster: vi.fn(() => ({
    setFromCamera: vi.fn(),
    intersectObject: vi.fn(() => []),
  })),
}))

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {},
    raycaster: {
      setFromCamera: vi.fn(),
      intersectObject: vi.fn(() => []),
    },
    pointer: { x: 0, y: 0 },
  })),
}))

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  useGLTF: vi.fn(() => ({
    scene: { clone: vi.fn() },
  })),
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-text">{children}</div>
  ),
}))

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-123'),
  },
})

// Mock URL.createObjectURL and revokeObjectURL
Object.defineProperty(global, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'blob:test-url'),
    revokeObjectURL: vi.fn(),
  },
})
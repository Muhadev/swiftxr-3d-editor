import { expect, afterEach, vi } from 'vitest'
import * as React from 'react'
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
  Vector3: vi.fn().mockImplementation((x = 0, y = 0, z = 0) => ({
    x,
    y,
    z,
    clone: vi.fn(() => new (vi.fn())()),
    project: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
    toFixed: vi.fn(() => '0.00'),
  })),
  Mesh: vi.fn(),
  SphereGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  Raycaster: vi.fn(() => ({
    setFromCamera: vi.fn(),
    intersectObject: vi.fn(() => [
      { point: { x: 1, y: 2, z: 3 } }
    ]),
  })),
  Object3D: vi.fn(),
}))

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    React.createElement('div', { 'data-testid': 'canvas' }, children)
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {
      position: { set: vi.fn() }
    },
    raycaster: {
      setFromCamera: vi.fn(),
      intersectObject: vi.fn(() => [
        { point: { x: 1, y: 2, z: 3 } }
      ]),
    },
    pointer: { x: 0, y: 0 },
  })),
}))

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => React.createElement('div', { 'data-testid': 'orbit-controls' }),
  useGLTF: vi.fn(() => ({
    scene: {
      clone: vi.fn(),
      position: { set: vi.fn() },
      rotation: { set: vi.fn() },
      scale: { set: vi.fn() }
    },
  })),
  Html: ({ children }: { children: React.ReactNode }) => (
    React.createElement('div', { 'data-testid': 'html-overlay' }, children)
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    React.createElement('div', { 'data-testid': 'three-text' }, children)
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

// Mock window properties
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
})
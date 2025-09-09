// src/components/__tests__/HotspotMarker.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

interface Hotspot {
  id: string
  position: { x: number; y: number; z: number }
  label: string
}

const HotspotMarker: React.FC<{
  hotspot: Hotspot
  isSelected: boolean
  onClick: () => void
}> = ({ hotspot, isSelected, onClick }) => {
  return (
    <div 
      data-testid="hotspot-marker"
      onClick={onClick}
      style={{
        backgroundColor: isSelected ? '#ff6b6b' : '#4ecdc4',
        transform: `scale(${isSelected ? 1.5 : 1})`,
      }}
    >
      <div data-testid="hotspot-label">{hotspot.label}</div>
      <div data-testid="hotspot-position">
        {hotspot.position.x.toFixed(2)}, {hotspot.position.y.toFixed(2)}, {hotspot.position.z.toFixed(2)}
      </div>
    </div>
  )
}

describe('HotspotMarker Component', () => {
  const mockHotspot: Hotspot = {
    id: 'test-hotspot-1',
    position: { x: 1.5, y: 2.0, z: -0.5 },
    label: 'Test Hotspot',
  }

  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hotspot with correct label and position', () => {
    render(
      <HotspotMarker
        hotspot={mockHotspot}
        isSelected={false}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByTestId('hotspot-label')).toHaveTextContent('Test Hotspot')
    expect(screen.getByTestId('hotspot-position')).toHaveTextContent('1.50, 2.00, -0.50')
  })

  it('applies selected styling when isSelected is true', () => {
    render(
      <HotspotMarker
        hotspot={mockHotspot}
        isSelected={true}
        onClick={mockOnClick}
      />
    )

    const marker = screen.getByTestId('hotspot-marker')
    expect(marker).toHaveStyle('background-color: #ff6b6b')
    expect(marker).toHaveStyle('transform: scale(1.5)')
  })

  it('applies default styling when isSelected is false', () => {
    render(
      <HotspotMarker
        hotspot={mockHotspot}
        isSelected={false}
        onClick={mockOnClick}
      />
    )

    const marker = screen.getByTestId('hotspot-marker')
    expect(marker).toHaveStyle('background-color: #4ecdc4')
    expect(marker).toHaveStyle('transform: scale(1)')
  })

  it('calls onClick when marker is clicked', () => {
    render(
      <HotspotMarker
        hotspot={mockHotspot}
        isSelected={false}
        onClick={mockOnClick}
      />
    )

    fireEvent.click(screen.getByTestId('hotspot-marker'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})

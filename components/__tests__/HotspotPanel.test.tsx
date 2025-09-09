// src/components/__tests__/HotspotPanel.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

interface Hotspot {
  id: string
  position: { x: number; y: number; z: number }
  label: string
}

const HotspotPanel: React.FC<{
  hotspots: Hotspot[]
  selectedHotspot: string | null
  onSelectHotspot: (id: string) => void
  onRemoveHotspot: (id: string) => void
}> = ({ hotspots, selectedHotspot, onSelectHotspot, onRemoveHotspot }) => {
  if (hotspots.length === 0) {
    return (
      <div data-testid="empty-state">
        <h3>Hotspots</h3>
        <p>Double-click on the 3D model to create hotspots</p>
      </div>
    )
  }

  return (
    <div data-testid="hotspot-panel">
      <h3>Hotspots ({hotspots.length})</h3>
      {hotspots.map((hotspot) => (
        <div
          key={hotspot.id}
          data-testid={`hotspot-item-${hotspot.id}`}
          className={selectedHotspot === hotspot.id ? 'selected' : ''}
          onClick={() => onSelectHotspot(hotspot.id)}
        >
          <h4>{hotspot.label}</h4>
          <p>
            Position: ({hotspot.position.x.toFixed(2)}, {hotspot.position.y.toFixed(2)}, {hotspot.position.z.toFixed(2)})
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemoveHotspot(hotspot.id)
            }}
            data-testid={`remove-hotspot-${hotspot.id}`}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}

describe('HotspotPanel Component', () => {
  const mockHotspots: Hotspot[] = [
    { id: 'hotspot-1', position: { x: 1, y: 2, z: 3 }, label: 'Hotspot 1' },
    { id: 'hotspot-2', position: { x: 4, y: 5, z: 6 }, label: 'Hotspot 2' },
  ]

  const mockOnSelectHotspot = vi.fn()
  const mockOnRemoveHotspot = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when no hotspots exist', () => {
    render(
      <HotspotPanel
        hotspots={[]}
        selectedHotspot={null}
        onSelectHotspot={mockOnSelectHotspot}
        onRemoveHotspot={mockOnRemoveHotspot}
      />
    )

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('Double-click on the 3D model to create hotspots')).toBeInTheDocument()
  })

  it('renders hotspot list when hotspots exist', () => {
    render(
      <HotspotPanel
        hotspots={mockHotspots}
        selectedHotspot={null}
        onSelectHotspot={mockOnSelectHotspot}
        onRemoveHotspot={mockOnRemoveHotspot}
      />
    )

    expect(screen.getByTestId('hotspot-panel')).toBeInTheDocument()
    expect(screen.getByText('Hotspots (2)')).toBeInTheDocument()
    expect(screen.getByTestId('hotspot-item-hotspot-1')).toBeInTheDocument()
    expect(screen.getByTestId('hotspot-item-hotspot-2')).toBeInTheDocument()
  })

  it('calls onSelectHotspot when hotspot item is clicked', () => {
    render(
      <HotspotPanel
        hotspots={mockHotspots}
        selectedHotspot={null}
        onSelectHotspot={mockOnSelectHotspot}
        onRemoveHotspot={mockOnRemoveHotspot}
      />
    )

    fireEvent.click(screen.getByTestId('hotspot-item-hotspot-1'))
    expect(mockOnSelectHotspot).toHaveBeenCalledWith('hotspot-1')
  })

  it('calls onRemoveHotspot when remove button is clicked', () => {
    render(
      <HotspotPanel
        hotspots={mockHotspots}
        selectedHotspot={null}
        onSelectHotspot={mockOnSelectHotspot}
        onRemoveHotspot={mockOnRemoveHotspot}
      />
    )

    fireEvent.click(screen.getByTestId('remove-hotspot-hotspot-1'))
    expect(mockOnRemoveHotspot).toHaveBeenCalledWith('hotspot-1')
    expect(mockOnSelectHotspot).not.toHaveBeenCalled()
  })

  it('applies selected class to selected hotspot', () => {
    render(
      <HotspotPanel
        hotspots={mockHotspots}
        selectedHotspot="hotspot-1"
        onSelectHotspot={mockOnSelectHotspot}
        onRemoveHotspot={mockOnRemoveHotspot}
      />
    )

    const selectedItem = screen.getByTestId('hotspot-item-hotspot-1')
    expect(selectedItem).toHaveClass('selected')
    
    const unselectedItem = screen.getByTestId('hotspot-item-hotspot-2')
    expect(unselectedItem).not.toHaveClass('selected')
  })
})
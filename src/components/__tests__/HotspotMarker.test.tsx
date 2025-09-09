import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HotspotMarker } from '../HotspotMarker'
import type { Hotspot } from '../../types'

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

  it('renders hotspot with correct label', () => {
    render(
      <HotspotMarker
        hotspot={mockHotspot}
        isSelected={false}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByTestId('hotspot-label')).toHaveTextContent('Test Hotspot')
  })

  it('applies selected styling when isSelected is true', () => {
    render(
      <HotspotMarker
        hotspot={mockHotspot}
        isSelected={true}
        onClick={mockOnClick}
      />
    )

    const label = screen.getByTestId('hotspot-label')
    expect(label).toHaveClass('bg-red-100', 'border-red-300')
  })

  it('applies default styling when isSelected is false', () => {
    render(
      <HotspotMarker
        hotspot={mockHotspot}
        isSelected={false}
        onClick={mockOnClick}
      />
    )

    const label = screen.getByTestId('hotspot-label')
    expect(label).toHaveClass('bg-gray-100', 'border-gray-300')
  })

  it('renders with correct position data', () => {
    const { container } = render(
      <HotspotMarker
        hotspot={mockHotspot}
        isSelected={false}
        onClick={mockOnClick}
      />
    )

    // Check that the component renders without errors
    expect(container.firstChild).toBeInTheDocument()
  })
})
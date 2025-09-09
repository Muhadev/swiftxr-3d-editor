import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HotspotPanel } from '../HotspotPanel'

// Mock the useHotspots hook
vi.mock('../../hooks/useHotspots', () => ({
  useHotspots: vi.fn(() => ({
    hotspots: [],
    selectedHotspot: null,
    removeHotspot: vi.fn(),
    selectHotspot: vi.fn(),
    editHotspotLabel: vi.fn(),
  })),
}))

import { useHotspots } from '../../hooks/useHotspots'

describe('HotspotPanel Component', () => {
  const mockHotspots = [
    { id: 'hotspot-1', position: { x: 1, y: 2, z: 3 }, label: 'Hotspot 1' },
    { id: 'hotspot-2', position: { x: 4, y: 5, z: 6 }, label: 'Hotspot 2' },
  ]

  const mockUseHotspots = useHotspots as ReturnType<typeof vi.fn>
  const mockRemoveHotspot = vi.fn()
  const mockSelectHotspot = vi.fn()
  const mockEditHotspotLabel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseHotspots.mockReturnValue({
      hotspots: [],
      selectedHotspot: null,
      removeHotspot: mockRemoveHotspot,
      selectHotspot: mockSelectHotspot,
      editHotspotLabel: mockEditHotspotLabel,
    })
  })

  it('shows empty state when no hotspots exist', () => {
    render(<HotspotPanel />)

    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('Double-click on the 3D model to create hotspots')).toBeInTheDocument()
  })

  it('renders hotspot list when hotspots exist', () => {
    mockUseHotspots.mockReturnValue({
      hotspots: mockHotspots,
      selectedHotspot: null,
      removeHotspot: mockRemoveHotspot,
      selectHotspot: mockSelectHotspot,
      editHotspotLabel: mockEditHotspotLabel,
    })

    render(<HotspotPanel />)

    expect(screen.getByTestId('hotspot-panel')).toBeInTheDocument()
    expect(screen.getByText('Hotspots (2)')).toBeInTheDocument()
    expect(screen.getByTestId('hotspot-item-hotspot-1')).toBeInTheDocument()
    expect(screen.getByTestId('hotspot-item-hotspot-2')).toBeInTheDocument()
  })

  it('calls selectHotspot when hotspot item is clicked', () => {
    mockUseHotspots.mockReturnValue({
      hotspots: mockHotspots,
      selectedHotspot: null,
      removeHotspot: mockRemoveHotspot,
      selectHotspot: mockSelectHotspot,
      editHotspotLabel: mockEditHotspotLabel,
    })

    render(<HotspotPanel />)

    fireEvent.click(screen.getByTestId('hotspot-item-hotspot-1'))
    expect(mockSelectHotspot).toHaveBeenCalledWith('hotspot-1')
  })

  it('calls removeHotspot when remove button is clicked', () => {
    mockUseHotspots.mockReturnValue({
      hotspots: mockHotspots,
      selectedHotspot: null,
      removeHotspot: mockRemoveHotspot,
      selectHotspot: mockSelectHotspot,
      editHotspotLabel: mockEditHotspotLabel,
    })

    render(<HotspotPanel />)

    fireEvent.click(screen.getByTestId('remove-hotspot-hotspot-1'))
    expect(mockRemoveHotspot).toHaveBeenCalledWith('hotspot-1')
    expect(mockSelectHotspot).not.toHaveBeenCalled()
  })

  it('applies selected class to selected hotspot', () => {
    mockUseHotspots.mockReturnValue({
      hotspots: mockHotspots,
      selectedHotspot: 'hotspot-1',
      removeHotspot: mockRemoveHotspot,
      selectHotspot: mockSelectHotspot,
      editHotspotLabel: mockEditHotspotLabel,
    })

    render(<HotspotPanel />)

    const selectedItem = screen.getByTestId('hotspot-item-hotspot-1')
    expect(selectedItem).toHaveClass('border-blue-500', 'bg-blue-50')
    
    const unselectedItem = screen.getByTestId('hotspot-item-hotspot-2')
    expect(unselectedItem).toHaveClass('border-gray-200')
    expect(unselectedItem).not.toHaveClass('border-blue-500')
  })
})
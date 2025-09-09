import { useState } from 'react'
import { useHotspots } from '../hooks/useHotspots'

export const HotspotPanel: React.FC = () => {
  const { hotspots, selectedHotspot, removeHotspot, selectHotspot, editHotspotLabel } = useHotspots()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState('')

  const handleEditStart = (id: string, currentLabel: string) => {
    setEditingId(id)
    setEditingLabel(currentLabel)
  }

  const handleEditSave = (id: string) => {
    if (editingLabel.trim()) {
      editHotspotLabel(id, editingLabel.trim())
    }
    setEditingId(null)
    setEditingLabel('')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditingLabel('')
  }

  if (hotspots.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg" data-testid="empty-state">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Hotspots</h3>
        <p className="text-gray-500 text-sm">
          Double-click on the 3D model to create hotspots
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg" data-testid="hotspot-panel">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Hotspots ({hotspots.length})
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedHotspot === hotspot.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => selectHotspot(hotspot.id)}
            data-testid={`hotspot-item-${hotspot.id}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {editingId === hotspot.id ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      className="text-sm font-medium border rounded px-2 py-1 flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(hotspot.id)
                        if (e.key === 'Escape') handleEditCancel()
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditSave(hotspot.id)
                      }}
                      className="text-green-500 hover:text-green-700 text-xs px-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCancel()
                      }}
                      className="text-gray-500 hover:text-gray-700 text-xs px-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h4 
                    className="font-medium text-sm text-gray-800 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditStart(hotspot.id, hotspot.label)
                    }}
                    title="Click to edit"
                  >
                    {hotspot.label}
                  </h4>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Position: ({hotspot.position.x.toFixed(2)}, {hotspot.position.y.toFixed(2)}, {hotspot.position.z.toFixed(2)})
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeHotspot(hotspot.id)
                }}
                className="text-red-500 hover:text-red-700 text-xs ml-2"
                data-testid={`remove-hotspot-${hotspot.id}`}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
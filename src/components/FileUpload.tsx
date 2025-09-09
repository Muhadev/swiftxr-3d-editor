import { FC, ChangeEvent } from 'react'
import { useModelLoader } from '../../hooks/useModelLoader'
import { useSceneStore } from '../../store/sceneStore'

export const FileUpload: FC = () => {
  const { loadModel } = useModelLoader()
  const { isLoading, error } = useSceneStore()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      loadModel(file)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Import 3D Model</h2>
      <div className="mb-4">
        <input
          type="file"
          accept=".glb"
          onChange={handleFileChange}
          disabled={isLoading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          data-testid="file-upload"
        />
      </div>
      {isLoading && (
        <div className="text-blue-600 text-sm" data-testid="loading">
          Loading model...
        </div>
      )}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded" data-testid="error">
          {error}
        </div>
      )}
    </div>
  )
}
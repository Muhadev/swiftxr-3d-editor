# SwiftXR 3D Editor

A React-based 3D model viewer and hotspot editor built with Three.js that allows users to import GLB models, explore them in 3D space, and add interactive hotspots for labeling and annotation.

## Features

- **3D Model Import**: Load GLB files with drag-and-drop support
- **Interactive 3D Scene**: Rotate, pan, and zoom around 3D models
- **Hotspot Management**: Double-click to create hotspots, edit labels, and manage annotations
- **Responsive Design**: Clean, modern interface with Tailwind CSS
- **Type-Safe**: Built with TypeScript for better development experience
- **Well-Tested**: Comprehensive test suite with Vitest and Testing Library

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite
- **Linting**: ESLint with TypeScript support

## Requirements

- Node.js 18+ 
- npm or yarn
- Modern browser with WebGL support

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd swiftxr-3d-editor
npm install
```

### 2. Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production

```bash
npm run build
npm run preview
```

## Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Individual component testing
- **Integration Tests**: Full user workflow testing
- **Performance Tests**: Hotspot handling efficiency
- **Error Handling Tests**: Graceful error recovery

## Usage Guide

### Importing 3D Models
1. Click "Choose File" in the Import section
2. Select a `.glb` file from your computer
3. The model will load in the 3D viewer

### Navigation Controls
- **Mouse Wheel**: Zoom in/out
- **Left Click + Drag**: Rotate around model
- **Right Click + Drag**: Pan the camera
- **Double Click**: Add hotspot at clicked position

### Managing Hotspots
- **Create**: Double-click on the 3D model surface
- **Select**: Click on hotspot marker or list item
- **Edit Label**: Click on hotspot label to rename
- **Delete**: Click "Remove" button in hotspot panel

## Project Structure

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   ├── FileUpload.tsx  # File import component
│   ├── HotspotMarker.tsx # 3D hotspot visualization
│   ├── HotspotPanel.tsx  # Hotspot management UI
│   ├── Model.tsx        # 3D model renderer
│   ├── Scene.tsx        # Main 3D scene
│   └── SceneInteraction.tsx # Click handling
├── hooks/              # Custom React hooks
│   ├── useHotspots.ts  # Hotspot management
│   └── useModelLoader.ts # Model loading logic
├── store/              # State management
│   └── sceneStore.ts   # Zustand store
├── types/              # TypeScript definitions
│   └── index.ts        # Type exports
└── test/               # Test configuration
    └── setup.ts        # Test environment setup
```

## Configuration Files

- **vite.config.ts**: Build tool configuration
- **vitest.config.ts**: Test runner configuration  
- **tailwind.config.js**: CSS framework setup
- **tsconfig.json**: TypeScript compiler options

## Troubleshooting

### Common Issues

**Model not loading?**
- Ensure file is a valid `.glb` format
- Check browser console for errors
- Verify file size (large models may take time)

**Tests failing?**
- Run `npm install` to ensure dependencies are current
- Clear test cache: `npx vitest run --no-cache`

**Build errors?**
- Check TypeScript errors: `npm run type-check`
- Verify all imports are correct
- Ensure all dependencies are installed

### Browser Support
- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

## Performance Considerations

- **Large Models**: Models over 50MB may experience slower loading
- **Many Hotspots**: Performance tested up to 1000+ hotspots
- **Memory Usage**: GLB models are cached in memory during session

## Development Notes

### Code Quality Standards
- TypeScript strict mode enabled
- ESLint with recommended rules
- Comprehensive test coverage
- Component-based architecture
- Custom hooks for business logic

### State Management Pattern
- Zustand for global state
- Local state for component-specific data
- Immutable state updates
- DevTools integration for debugging

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes with tests
4. Run test suite: `npm test`
5. Submit pull request

## License

MIT License - see LICENSE file for details

---

**Built for SwiftXR Technical Assessment**  
Demonstrates React, Three.js, and TypeScript proficiency with modern development practices.
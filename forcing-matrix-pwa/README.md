# Forcing Matrix Generator PWA

A responsive Progressive Web App (PWA) that generates mathematical forcing matrices for mentalism and magic tricks. The app creates 4x4 matrices where any combination of one number from each column sums to a specified target number.

## Features

### Core Functionality
- **Target Number Input**: Enter any number from 1 to 9999
- **4x4 Matrix Generation**: Automatically generates forcing matrices
- **Real-time Editing**: Edit any cell and watch the matrix recalculate
- **Smart Recalculation**: Maintains forcing property when cells are edited
- **Validation**: Verifies all 256 combinations sum to target

### PWA Features
- **Installable**: Can be installed on mobile devices and desktop
- **Offline Support**: Works without internet connection
- **App-like Experience**: Full-screen mode when installed
- **Responsive Design**: Optimized for all screen sizes
- **Touch-friendly**: Optimized for mobile interactions

### User Interface
- **Modern Design**: Clean, intuitive interface with dark/light theme support
- **Visual Feedback**: Different colors for user-edited vs calculated cells
- **Keyboard Navigation**: Arrow keys to navigate between cells
- **Accessibility**: Proper ARIA labels and focus management
- **Haptic Feedback**: Vibration on supported devices

### Matrix Operations
- **Copy to Clipboard**: Copy matrix as text
- **Share**: Use Web Share API or fallback to clipboard
- **Reset**: Clear all edits and regenerate
- **Export**: Export matrix as image (placeholder)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin with Workbox
- **Styling**: CSS3 with CSS Grid and Flexbox
- **State Management**: React Hooks

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Development Setup

1. **Clone and install dependencies**:
   ```bash
   cd forcing-matrix-pwa
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

### PWA Icons

The app includes placeholder files for PWA icons. To complete the setup:

1. Replace the placeholder files in `/public/`:
   - `favicon.ico` (16x16, 32x32, 48x48)
   - `pwa-192x192.png` (192x192)
   - `pwa-512x512.png` (512x512)

2. Generate icons using tools like:
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [Favicon Generator](https://www.favicon-generator.org/)

## Usage

### Basic Usage

1. **Enter Target Number**: Type a number between 1 and 9999
2. **Generate Matrix**: Click "Generate Matrix" or press Enter
3. **Edit Cells**: Click any cell to edit its value
4. **Watch Recalculation**: Other cells automatically adjust to maintain the forcing property

### Matrix Editing

- **User-edited cells**: Blue border and background
- **Calculated cells**: Gray border and background
- **Invalid cells**: Red border (if validation fails)

### Keyboard Navigation

- **Arrow Keys**: Navigate between cells
- **Enter**: Generate matrix (in target input)
- **Tab**: Standard tab navigation

### Mobile Features

- **Touch-optimized**: Large touch targets
- **Haptic feedback**: Vibration on button presses
- **Install prompt**: Add to home screen
- **Offline mode**: Works without internet

## Matrix Algorithm

The forcing matrix works by ensuring that any combination of one number from each column sums to the target number. This creates 256 possible combinations (4^4), all of which must equal the target.

### Recalculation Strategy

When a user edits a cell:

1. **Bottom Row Strategy**: Try to recalculate only the bottom row
2. **Right Column Strategy**: If bottom row fails, try rightmost column
3. **Full Recalculation**: If both fail, recalculate all non-user-edited cells

### Validation

The app validates all 256 combinations after each edit to ensure the forcing property is maintained.

## File Structure

```
src/
├── components/
│   ├── MatrixCell.tsx      # Individual matrix cell component
│   ├── MatrixGrid.tsx      # 4x4 grid container
│   ├── TargetInput.tsx     # Target number input
│   └── Controls.tsx        # Action buttons and controls
├── utils/
│   └── matrixGenerator.ts  # Matrix generation and validation logic
├── styles/
│   └── main.css           # Main stylesheet with responsive design
├── App.tsx                # Main application component
└── main.tsx              # Application entry point

public/
├── manifest.json          # PWA manifest (auto-generated)
├── favicon.ico           # App favicon
├── pwa-192x192.png       # PWA icon (192x192)
└── pwa-512x512.png       # PWA icon (512x512)
```

## Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11.3+)
- **Edge**: Full support

## PWA Features

### Installation
- **Mobile**: Add to home screen via browser menu
- **Desktop**: Install prompt in address bar
- **Chrome**: "Install" button in toolbar

### Offline Support
- **Service Worker**: Caches app shell and assets
- **Workbox**: Advanced caching strategies
- **IndexedDB**: Local storage for user data

### App-like Experience
- **Standalone Mode**: Hides browser UI when installed
- **Splash Screen**: Custom loading screen
- **Theme Colors**: Consistent branding

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- PWA community for best practices
- Magic and mentalism community for the mathematical concepts

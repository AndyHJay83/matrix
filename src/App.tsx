import React, { useState, useEffect, useCallback } from 'react';
import type { Matrix } from './utils/matrixGenerator';
import {
  generateForcingMatrix,
  recalculateMatrix,
  validateMatrix,
  getValidationMessage,
  resetMatrix,
  matchMatrixLength
} from './utils/matrixGenerator';
import TargetInput from './components/TargetInput';
import MatrixGrid from './components/MatrixGrid';
import Controls from './components/Controls';
import ObjectInput from './components/ObjectInput';
import FlashcardView from './components/FlashcardView';
import './styles/main.css';

// Track user edits: { [col]: { row, value } }
type UserEdits = { [col: number]: { row: number, value: number } };

type ViewMode = 'matrix' | 'objects' | 'flashcards';

function App() {
  const [target, setTarget] = useState(100);
  const [variance, setVariance] = useState(1.0); // 0 = minimal variance, 1 = maximum variance
  const [matrix, setMatrix] = useState<Matrix>([]);
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [userEdits, setUserEdits] = useState<UserEdits>({});
  const [objects, setObjects] = useState<string[][]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');

  // Check if app is installed as PWA
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  // Generate initial matrix
  useEffect(() => {
    if (target >= 1 && target <= 9999999) {
      generateMatrix();
    }
  }, []);

  // Regenerate matrix when variance changes
  useEffect(() => {
    if (target >= 1 && target <= 9999999 && matrix.length > 0) {
      generateMatrix();
    }
  }, [variance]);

  // Validate matrix whenever it changes
  useEffect(() => {
    if (matrix.length > 0) {
      const valid = validateMatrix(matrix, target);
      setIsValid(valid);
      setValidationMessage(getValidationMessage(matrix, target));
    }
  }, [matrix, target]);

  const generateMatrix = useCallback(async () => {
    if (target < 1 || target > 9999999) return;
    
    setIsGenerating(true);
    
    // Simulate some processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const newMatrix = generateForcingMatrix(target, variance);
      setMatrix(newMatrix);
    } catch (error) {
      console.error('Error generating matrix:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [target, variance]);

  const handleTargetChange = (newTarget: number) => {
    setTarget(newTarget);
  };

  const handleVarianceChange = (newVariance: number) => {
    setVariance(newVariance);
  };

  const handleCellChange = useCallback((row: number, col: number, value: number) => {
    setUserEdits(prev => {
      // Only allow one edit per column
      if (prev[col] && prev[col].row !== row) return prev;
      return { ...prev, [col]: { row, value } };
    });
    setMatrix(prevMatrix => {
      const newMatrix = recalculateMatrix(prevMatrix, target, row, col, value, userEdits);
      return newMatrix;
    });
  }, [target, userEdits]);

  const handleReset = () => {
    if (target >= 1 && target <= 9999999) {
      // Clear all user edits
      setUserEdits({});
      // Generate a fresh matrix
      const newMatrix = resetMatrix(target, variance);
      setMatrix(newMatrix);
    }
  };

  const handleMatchLength = () => {
    if (target >= 1 && target <= 9999999 && matrix.length > 0) {
      const targetDigits = target.toString().length;
      const minTargetForDigits = Math.pow(10, targetDigits - 1);
      
      if (target < minTargetForDigits) {
        // Show warning to user
        alert(`Target ${target} is too small for ${targetDigits} digits. Minimum required: ${minTargetForDigits}`);
        return;
      }
      
      const newMatrix = matchMatrixLength(matrix, target);
      setMatrix(newMatrix);
      // Clear user edits since we're recalculating
      setUserEdits({});
    }
  };

  const handleObjectsSubmit = (objectList: string[]) => {
    // Convert flat array to 4x4 grid
    const objectGrid: string[][] = [];
    for (let i = 0; i < 4; i++) {
      objectGrid[i] = objectList.slice(i * 4, (i + 1) * 4);
    }
    setObjects(objectGrid);
    setViewMode('objects');
  };

  const handleStartFlashcards = () => {
    setViewMode('flashcards');
  };

  const handleBackToMatrix = () => {
    setViewMode('matrix');
    setObjects([]);
  };

  // Handle PWA install prompt
  useEffect(() => {
    let deferredPrompt: any;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // You could show an install button here
      console.log('PWA install prompt available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Forcing Matrix Generator</h1>
        {isInstalled && (
          <p style={{ fontSize: '0.9rem', color: 'var(--accent-color)', marginTop: '0.5rem' }}>
            ✓ Running as installed app
          </p>
        )}
      </header>

      {viewMode === 'matrix' && (
        <>
          <TargetInput
            target={target}
            onTargetChange={handleTargetChange}
            onGenerate={generateMatrix}
            disabled={isGenerating}
          />

          {/* Variance Slider */}
          <div className="variance-control">
            <label htmlFor="variance-slider" className="variance-label">
              Number Variance: {Math.round(variance * 100)}%
            </label>
            <input
              id="variance-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={variance}
              onChange={(e) => handleVarianceChange(parseFloat(e.target.value))}
              className="variance-slider"
              disabled={isGenerating}
            />
            <div className="variance-labels">
              <span>Similar Numbers</span>
              <span>Varied Numbers</span>
            </div>
          </div>

          {matrix.length > 0 && (
            <>
              <div className="matrix-instructions">
                <p className="subtitle">
                  💡 <strong>Tip:</strong> You can edit one cell per column. The rest will update to maintain the forcing property. You may have to reduce the variance slider before the matrix works.
                </p>
              </div>
              
              <MatrixGrid
                matrix={matrix}
                onCellChange={handleCellChange}
                disabled={isGenerating}
                userEdits={userEdits}
              />

              <div className={`validation ${isValid ? 'valid' : 'invalid'}`}>
                {validationMessage}
              </div>

              <Controls
                matrix={matrix}
                target={target}
                onReset={handleReset}
                onMatchLength={handleMatchLength}
                isValid={isValid}
                disabled={isGenerating}
              />

              <div className="object-section">
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => setViewMode('objects')}
                  disabled={isGenerating}
                >
                  Assign Objects to Matrix
                </button>
              </div>
            </>
          )}
        </>
      )}

      {viewMode === 'objects' && (
        <>
          <div className="view-header">
            <button className="btn btn-secondary" onClick={handleBackToMatrix}>
              ← Back to Matrix
            </button>
            <h2>Assign Objects to Matrix</h2>
          </div>

          <ObjectInput
            onObjectsSubmit={handleObjectsSubmit}
            disabled={isGenerating}
          />

          {objects.length > 0 && (
            <>
              <div className="matrix-instructions">
                <p className="subtitle">
                  💡 <strong>Objects assigned to matrix:</strong> Click "DONE" when ready to start flashcards.
                </p>
              </div>
              
              <MatrixGrid
                matrix={matrix}
                onCellChange={handleCellChange}
                disabled={isGenerating}
                userEdits={userEdits}
                objects={objects}
                onDone={handleStartFlashcards}
                showDoneButton={true}
              />
            </>
          )}
        </>
      )}

      {viewMode === 'flashcards' && (
        <FlashcardView
          objects={objects}
          onBack={handleBackToMatrix}
        />
      )}

      {/* PWA install prompt */}
      {!isInstalled && viewMode === 'matrix' && (
        <div style={{ 
          textAlign: 'center', 
          padding: '1rem', 
          background: 'var(--surface-color)', 
          borderRadius: 'var(--border-radius)',
          marginTop: '2rem'
        }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Install this app for a better experience
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              // This would trigger the install prompt
              console.log('Install button clicked');
            }}
          >
            Install App
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

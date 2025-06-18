import React, { useState, useEffect, useCallback } from 'react';
import type { Matrix } from './utils/matrixGenerator';
import {
  generateForcingMatrix,
  recalculateMatrix,
  validateMatrix,
  getValidationMessage,
  resetMatrix
} from './utils/matrixGenerator';
import TargetInput from './components/TargetInput';
import MatrixGrid from './components/MatrixGrid';
import Controls from './components/Controls';
import './styles/main.css';

// Track user edits: { [col]: { row, value } }
type UserEdits = { [col: number]: { row: number, value: number } };

function App() {
  const [target, setTarget] = useState(100);
  const [variance, setVariance] = useState(0.5); // 0 = minimal variance, 1 = maximum variance
  const [matrix, setMatrix] = useState<Matrix>([]);
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [userEdits, setUserEdits] = useState<UserEdits>({});

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
      const newMatrix = resetMatrix(target, variance);
      setMatrix(newMatrix);
    }
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
        <p className="subtitle">
          Enter a target number to generate a 4x4 matrix where any path (one number from each column) equals your target
        </p>
        {isInstalled && (
          <p style={{ fontSize: '0.9rem', color: 'var(--accent-color)', marginTop: '0.5rem' }}>
            ✓ Running as installed app
          </p>
        )}
      </header>

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
              💡 <strong>Tip:</strong> Edit one cell per column. The rest will update to maintain the forcing property.
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
            isValid={isValid}
            disabled={isGenerating}
          />
        </>
      )}

      {/* PWA install prompt */}
      {!isInstalled && (
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

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

function App() {
  const [target, setTarget] = useState(100);
  const [matrix, setMatrix] = useState<Matrix>([]);
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Check if app is installed as PWA
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  // Generate initial matrix
  useEffect(() => {
    if (target >= 1 && target <= 9999) {
      generateMatrix();
    }
  }, []);

  // Validate matrix whenever it changes
  useEffect(() => {
    if (matrix.length > 0) {
      const valid = validateMatrix(matrix, target);
      setIsValid(valid);
      setValidationMessage(getValidationMessage(matrix, target));
    }
  }, [matrix, target]);

  const generateMatrix = useCallback(async () => {
    if (target < 1 || target > 9999) return;
    
    setIsGenerating(true);
    
    // Simulate some processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const newMatrix = generateForcingMatrix(target);
      setMatrix(newMatrix);
    } catch (error) {
      console.error('Error generating matrix:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [target]);

  const handleTargetChange = (newTarget: number) => {
    setTarget(newTarget);
  };

  const handleCellChange = useCallback((row: number, col: number, value: number) => {
    setMatrix(prevMatrix => {
      const newMatrix = recalculateMatrix(prevMatrix, target, row, col);
      return newMatrix;
    });
  }, [target]);

  const handleReset = () => {
    if (target >= 1 && target <= 9999) {
      const newMatrix = resetMatrix(target);
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

      {matrix.length > 0 && (
        <>
          <MatrixGrid
            matrix={matrix}
            onCellChange={handleCellChange}
            disabled={isGenerating}
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

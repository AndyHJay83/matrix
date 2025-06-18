import React, { useState } from 'react';
import type { Matrix } from '../utils/matrixGenerator';
import { copyMatrixToClipboard, shareMatrix } from '../utils/matrixGenerator';

interface ControlsProps {
  matrix: Matrix;
  target: number;
  onReset: () => void;
  isValid: boolean;
  disabled?: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  matrix,
  target,
  onReset,
  isValid,
  disabled = false
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopy = async () => {
    try {
      const matrixText = copyMatrixToClipboard(matrix);
      await navigator.clipboard.writeText(matrixText);
      showToastMessage('Matrix copied to clipboard!');
    } catch (error) {
      showToastMessage('Failed to copy matrix', 'error');
    }
  };

  const handleShare = async () => {
    try {
      await shareMatrix(matrix, target);
      showToastMessage('Matrix shared successfully!');
    } catch (error) {
      showToastMessage('Failed to share matrix', 'error');
    }
  };

  const handleHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <>
      <div className="controls">
        <button
          className="btn btn-secondary"
          onClick={() => {
            onReset();
            handleHapticFeedback();
          }}
          disabled={disabled}
        >
          Reset Matrix
        </button>
        
        <button
          className="btn btn-success"
          onClick={() => {
            handleCopy();
            handleHapticFeedback();
          }}
          disabled={disabled || !isValid}
        >
          Copy Matrix
        </button>
        
        <button
          className="btn btn-primary"
          onClick={() => {
            handleShare();
            handleHapticFeedback();
          }}
          disabled={disabled || !isValid}
        >
          Share Matrix
        </button>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className={`toast ${toastType} show`}>
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default Controls; 
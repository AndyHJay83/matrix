import React from 'react';
import type { MatrixCell as MatrixCellType } from '../utils/matrixGenerator';

interface MatrixCellProps {
  cell: MatrixCellType;
  row: number;
  col: number;
  onCellChange: (row: number, col: number, value: number) => void;
  disabled?: boolean;
}

const MatrixCell: React.FC<MatrixCellProps> = ({
  cell,
  row,
  col,
  onCellChange,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const value = parseInt(inputValue) || 0;
    
    // Allow any positive integer up to 9,999,999
    const validValue = Math.max(1, Math.min(9999999, value));
    onCellChange(row, col, validValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow navigation with arrow keys
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      
      const inputs = document.querySelectorAll('.matrix-input') as NodeListOf<HTMLInputElement>;
      const currentIndex = row * 4 + col;
      let nextIndex = currentIndex;
      
      switch (e.key) {
        case 'ArrowUp':
          nextIndex = Math.max(0, currentIndex - 4);
          break;
        case 'ArrowDown':
          nextIndex = Math.min(15, currentIndex + 4);
          break;
        case 'ArrowLeft':
          nextIndex = Math.max(row * 4, currentIndex - 1);
          break;
        case 'ArrowRight':
          nextIndex = Math.min(row * 4 + 3, currentIndex + 1);
          break;
      }
      
      if (nextIndex !== currentIndex) {
        inputs[nextIndex]?.focus();
      }
    }
  };

  const getInputClassName = () => {
    let className = 'matrix-input';
    
    if (cell.isUserEdited) {
      className += ' user-edited';
    } else if (cell.isCalculated) {
      className += ' calculated';
    }
    
    if (disabled) {
      className += ' loading';
    }
    
    return className;
  };

  return (
    <div className="matrix-cell">
      <input
        type="number"
        className={getInputClassName()}
        value={cell.value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        min="1"
        max="9999999"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={`Matrix cell at row ${row + 1}, column ${col + 1}`}
      />
    </div>
  );
};

export default MatrixCell; 
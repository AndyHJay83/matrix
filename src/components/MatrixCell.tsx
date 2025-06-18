import React from 'react';
import type { MatrixCell as MatrixCellType } from '../utils/matrixGenerator';

interface MatrixCellProps {
  cell: MatrixCellType | string;
  row: number;
  col: number;
  onCellChange: (row: number, col: number, value: number) => void;
  disabled?: boolean;
  isObject?: boolean;
}

const MatrixCell: React.FC<MatrixCellProps> = ({
  cell,
  row,
  col,
  onCellChange,
  disabled = false,
  isObject = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isObject) return; // Don't allow editing objects
    
    const inputValue = e.target.value;
    const value = parseInt(inputValue) || 0;
    
    // Allow any positive integer up to 9,999,999
    const validValue = Math.max(1, Math.min(9999999, value));
    onCellChange(row, col, validValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isObject) return; // Don't allow navigation for objects
    
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
    
    if (isObject) {
      className += ' object-cell';
    } else if (typeof cell === 'object') {
      if (cell.isUserEdited) {
        className += ' user-edited';
      } else if (cell.isCalculated) {
        className += ' calculated';
      }
    }
    
    if (disabled) {
      className += ' loading';
    }
    
    return className;
  };

  const displayValue = typeof cell === 'object' ? cell.value : cell;

  return (
    <div className="matrix-cell">
      <input
        type={isObject ? "text" : "number"}
        className={getInputClassName()}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled || isObject}
        min={isObject ? undefined : "1"}
        max={isObject ? undefined : "9999999"}
        inputMode={isObject ? "text" : "numeric"}
        pattern={isObject ? undefined : "[0-9]*"}
        aria-label={`${isObject ? 'Object' : 'Matrix cell'} at row ${row + 1}, column ${col + 1}`}
        readOnly={isObject}
      />
    </div>
  );
};

export default MatrixCell; 
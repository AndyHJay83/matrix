import React from 'react';
import type { Matrix } from '../utils/matrixGenerator';
import MatrixCell from './MatrixCell';

interface MatrixGridProps {
  matrix: Matrix;
  onCellChange: (row: number, col: number, value: number) => void;
  disabled?: boolean;
  userEdits: { [col: number]: { row: number, value: number } };
  objects?: string[][];
  onDone?: () => void;
  showDoneButton?: boolean;
}

const MatrixGrid: React.FC<MatrixGridProps> = ({
  matrix,
  onCellChange,
  disabled = false,
  userEdits,
  objects,
  onDone,
  showDoneButton = false
}) => {
  return (
    <div className="matrix-container">
      <div className="matrix-grid">
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            // Only allow editing if this column has not been edited, or this is the edited cell
            const colEdit = userEdits[colIndex];
            const isEditable =
              !disabled &&
              (!colEdit || colEdit.row === rowIndex) &&
              !objects; // Don't allow editing when objects are assigned
            
            const displayValue = objects ? objects[rowIndex][colIndex] : cell;
            
            return (
              <MatrixCell
                key={`${rowIndex}-${colIndex}`}
                cell={displayValue}
                row={rowIndex}
                col={colIndex}
                onCellChange={onCellChange}
                disabled={!isEditable}
                isObject={!!objects}
              />
            );
          })
        )}
      </div>
      
      {showDoneButton && objects && (
        <div className="done-button-container">
          <button
            className="btn btn-success btn-large"
            onClick={onDone}
            disabled={disabled}
          >
            DONE - Start Flashcards
          </button>
        </div>
      )}
    </div>
  );
};

export default MatrixGrid; 
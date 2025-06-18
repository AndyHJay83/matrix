import React from 'react';
import type { Matrix } from '../utils/matrixGenerator';
import MatrixCell from './MatrixCell';

interface MatrixGridProps {
  matrix: Matrix;
  onCellChange: (row: number, col: number, value: number) => void;
  disabled?: boolean;
  userEdits: { [col: number]: { row: number, value: number } };
}

const MatrixGrid: React.FC<MatrixGridProps> = ({
  matrix,
  onCellChange,
  disabled = false,
  userEdits
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
              (!colEdit || colEdit.row === rowIndex);
            return (
              <MatrixCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
                onCellChange={onCellChange}
                disabled={!isEditable}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default MatrixGrid; 
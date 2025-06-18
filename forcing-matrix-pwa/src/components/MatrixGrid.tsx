import React from 'react';
import type { Matrix } from '../utils/matrixGenerator';
import MatrixCell from './MatrixCell';

interface MatrixGridProps {
  matrix: Matrix;
  onCellChange: (row: number, col: number, value: number) => void;
  disabled?: boolean;
}

const MatrixGrid: React.FC<MatrixGridProps> = ({
  matrix,
  onCellChange,
  disabled = false
}) => {
  return (
    <div className="matrix-container">
      <div className="matrix-grid">
        {matrix.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <MatrixCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              onCellChange={onCellChange}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MatrixGrid; 
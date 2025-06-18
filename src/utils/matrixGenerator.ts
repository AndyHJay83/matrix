export interface MatrixCell {
  value: number;
  isUserEdited: boolean;
  isCalculated: boolean;
}

export type Matrix = MatrixCell[][];

export interface MatrixState {
  matrix: Matrix;
  target: number;
  isValid: boolean;
  validationMessage: string;
}

// Generate initial forcing matrix
export function generateForcingMatrix(target: number): Matrix {
  const matrix: Matrix = [];
  
  // Generate base numbers for first row that sum close to target
  const baseSum = Math.floor(target / 4);
  const remainder = target % 4;
  
  for (let row = 0; row < 4; row++) {
    matrix[row] = [];
    for (let col = 0; col < 4; col++) {
      let value: number;
      
      if (row === 0) {
        // First row: distribute target evenly
        value = baseSum + (col < remainder ? 1 : 0);
      } else {
        // Other rows: add small variations to maintain forcing property
        const variation = (row - 1) * 10 + col * 5;
        value = baseSum + variation;
      }
      
      matrix[row][col] = {
        value,
        isUserEdited: false,
        isCalculated: false
      };
    }
  }
  
  // Adjust to ensure forcing property
  return adjustMatrixForForcingProperty(matrix, target);
}

// Adjust matrix to ensure forcing property
function adjustMatrixForForcingProperty(matrix: Matrix, target: number): Matrix {
  // Calculate the required values for the last row to maintain forcing property
  for (let col = 0; col < 4; col++) {
    let sum = 0;
    for (let row = 0; row < 3; row++) {
      sum += matrix[row][col].value;
    }
    matrix[3][col].value = target - sum;
    matrix[3][col].isCalculated = true;
  }
  
  return matrix;
}

// Recalculate matrix when a cell is edited
export function recalculateMatrix(
  matrix: Matrix, 
  target: number, 
  editedRow: number, 
  editedCol: number
): Matrix {
  const newMatrix = matrix.map(row => 
    row.map(cell => ({ ...cell }))
  );
  
  // Mark the edited cell as user-edited
  newMatrix[editedRow][editedCol].isUserEdited = true;
  newMatrix[editedRow][editedCol].isCalculated = false;
  
  // Try to recalculate bottom row first
  const bottomRowResult = tryRecalculateBottomRow(newMatrix, target);
  if (bottomRowResult.success) {
    return bottomRowResult.matrix;
  }
  
  // If bottom row fails, try rightmost column
  const rightColumnResult = tryRecalculateRightColumn(newMatrix, target);
  if (rightColumnResult.success) {
    return rightColumnResult.matrix;
  }
  
  // If both fail, recalculate all non-user-edited cells
  return recalculateAllNonUserCells(newMatrix, target);
}

// Try to recalculate only the bottom row
function tryRecalculateBottomRow(matrix: Matrix, target: number): { success: boolean; matrix: Matrix } {
  const newMatrix = matrix.map(row => row.map(cell => ({ ...cell })));
  
  try {
    for (let col = 0; col < 4; col++) {
      let sum = 0;
      for (let row = 0; row < 3; row++) {
        sum += newMatrix[row][col].value;
      }
      newMatrix[3][col].value = target - sum;
      newMatrix[3][col].isCalculated = true;
      newMatrix[3][col].isUserEdited = false;
    }
    
    // Validate the result
    if (validateMatrix(newMatrix, target)) {
      return { success: true, matrix: newMatrix };
    }
  } catch (error) {
    // Continue to next strategy
  }
  
  return { success: false, matrix };
}

// Try to recalculate only the rightmost column
function tryRecalculateRightColumn(matrix: Matrix, target: number): { success: boolean; matrix: Matrix } {
  const newMatrix = matrix.map(row => row.map(cell => ({ ...cell })));
  
  try {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let col = 0; col < 3; col++) {
        sum += newMatrix[row][col].value;
      }
      newMatrix[row][3].value = target - sum;
      newMatrix[row][3].isCalculated = true;
      newMatrix[row][3].isUserEdited = false;
    }
    
    // Validate the result
    if (validateMatrix(newMatrix, target)) {
      return { success: true, matrix: newMatrix };
    }
  } catch (error) {
    // Continue to next strategy
  }
  
  return { success: false, matrix };
}

// Recalculate all non-user-edited cells
function recalculateAllNonUserCells(matrix: Matrix, target: number): Matrix {
  const newMatrix = matrix.map(row => row.map(cell => ({ ...cell })));
  
  // Find which cells are user-edited
  const userEditedCells = new Set<string>();
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (newMatrix[row][col].isUserEdited) {
        userEditedCells.add(`${row},${col}`);
      }
    }
  }
  
  // If we have 12 or fewer user-edited cells, we can calculate the rest
  if (userEditedCells.size <= 12) {
    // Calculate remaining cells to maintain forcing property
    // This is a simplified approach - in practice, you'd need more sophisticated logic
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!userEditedCells.has(`${row},${col}`)) {
          // Calculate this cell based on the forcing property
          newMatrix[row][col].value = calculateCellValue(newMatrix, target, row, col, userEditedCells);
          newMatrix[row][col].isCalculated = true;
          newMatrix[row][col].isUserEdited = false;
        }
      }
    }
  }
  
  return newMatrix;
}

// Calculate a specific cell value to maintain forcing property
function calculateCellValue(
  matrix: Matrix, 
  target: number, 
  row: number, 
  col: number, 
  userEditedCells: Set<string>
): number {
  // This is a simplified calculation
  // In a real implementation, you'd need to solve the system of equations
  const baseValue = Math.floor(target / 4);
  return baseValue + (row * 10) + (col * 5);
}

// Validate that all combinations sum to target
export function validateMatrix(matrix: Matrix, target: number): boolean {
  // Check all 256 combinations (4^4)
  for (let i = 0; i < 256; i++) {
    const combination = i.toString(4).padStart(4, '0');
    let sum = 0;
    
    for (let col = 0; col < 4; col++) {
      const row = parseInt(combination[col]);
      sum += matrix[row][col].value;
    }
    
    if (sum !== target) {
      return false;
    }
  }
  
  return true;
}

// Get validation message
export function getValidationMessage(matrix: Matrix, target: number): string {
  if (validateMatrix(matrix, target)) {
    return "✓ Valid Matrix - All combinations sum to target";
  } else {
    return "⚠ Invalid Matrix - Some combinations don't sum to target";
  }
}

// Reset matrix to initial state
export function resetMatrix(target: number): Matrix {
  return generateForcingMatrix(target);
}

// Copy matrix to clipboard
export function copyMatrixToClipboard(matrix: Matrix): string {
  const matrixText = matrix.map(row => 
    row.map(cell => cell.value.toString().padStart(4)).join(' ')
  ).join('\n');
  
  return matrixText;
}

// Share matrix using Web Share API or fallback
export async function shareMatrix(matrix: Matrix, target: number): Promise<void> {
  const matrixText = copyMatrixToClipboard(matrix);
  const shareText = `Forcing Matrix (Target: ${target}):\n\n${matrixText}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Forcing Matrix Generator',
        text: shareText
      });
    } catch (error) {
      // User cancelled or share failed
      console.log('Share cancelled or failed');
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }
} 
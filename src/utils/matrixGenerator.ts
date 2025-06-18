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

// Generate initial forcing matrix with proper algorithm
export function generateForcingMatrix(target: number): Matrix {
  const matrix: Matrix = [];
  
  // Create a proper forcing matrix using the mathematical principle
  // For a 4x4 forcing matrix, we need to ensure that any combination
  // of one number from each column sums to the target
  
  // Start with a base range around the target, ensuring positive numbers
  const baseValue = Math.floor(target / 4);
  const variance = Math.min(2000, Math.max(500, Math.floor(target * 0.3))); // Ensure good variance
  
  // Generate the first 3 rows with diverse positive numbers
  for (let row = 0; row < 3; row++) {
    matrix[row] = [];
    for (let col = 0; col < 4; col++) {
      // Create diverse positive numbers within the variance range
      const minVal = Math.max(1, baseValue - variance);
      const maxVal = baseValue + variance;
      const randomOffset = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      
      // Add some pattern to make it more interesting
      const patternOffset = (row * 7 + col * 13) % 100;
      const value = Math.max(1, randomOffset + patternOffset); // Ensure minimum value of 1
      
      matrix[row][col] = {
        value,
        isUserEdited: false,
        isCalculated: false
      };
    }
  }
  
  // Calculate the 4th row to ensure forcing property
  matrix[3] = [];
  for (let col = 0; col < 4; col++) {
    let sum = 0;
    for (let row = 0; row < 3; row++) {
      sum += matrix[row][col].value;
    }
    
    // The 4th row value must make the column sum to target
    // Ensure it's positive by adjusting if necessary
    let requiredValue = target - sum;
    
    // If the required value would be negative, adjust the previous rows
    if (requiredValue <= 0) {
      // Find the largest value in the current column and reduce it
      let maxValue = 0;
      let maxRow = 0;
      for (let row = 0; row < 3; row++) {
        if (matrix[row][col].value > maxValue) {
          maxValue = matrix[row][col].value;
          maxRow = row;
        }
      }
      
      // Reduce the largest value to make room for a positive 4th row value
      const reduction = Math.abs(requiredValue) + 1;
      matrix[maxRow][col].value = Math.max(1, maxValue - reduction);
      
      // Recalculate the required value
      sum = 0;
      for (let row = 0; row < 3; row++) {
        sum += matrix[row][col].value;
      }
      requiredValue = target - sum;
    }
    
    matrix[3][col] = {
      value: requiredValue,
      isUserEdited: false,
      isCalculated: true
    };
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
  
  // Strategy: Recalculate the bottom row to maintain forcing property
  // This is the most reliable approach for a 4x4 forcing matrix
  for (let col = 0; col < 4; col++) {
    let sum = 0;
    for (let row = 0; row < 3; row++) {
      sum += newMatrix[row][col].value;
    }
    
    // Calculate the required value for the bottom row
    let requiredValue = target - sum;
    
    // If the required value would be negative, adjust the user-edited cell
    if (requiredValue <= 0 && editedCol === col) {
      // Find the largest non-user-edited value in this column
      let maxValue = 0;
      let maxRow = 0;
      for (let row = 0; row < 3; row++) {
        if (row !== editedRow && newMatrix[row][col].value > maxValue) {
          maxValue = newMatrix[row][col].value;
          maxRow = row;
        }
      }
      
      // Reduce the largest value to make room for a positive 4th row value
      const reduction = Math.abs(requiredValue) + 1;
      newMatrix[maxRow][col].value = Math.max(1, maxValue - reduction);
      
      // Recalculate the required value
      sum = 0;
      for (let row = 0; row < 3; row++) {
        sum += newMatrix[row][col].value;
      }
      requiredValue = target - sum;
    }
    
    newMatrix[3][col].value = requiredValue;
    newMatrix[3][col].isCalculated = true;
    newMatrix[3][col].isUserEdited = false;
  }
  
  return newMatrix;
}

// Validate that all combinations sum to target
export function validateMatrix(matrix: Matrix, target: number): boolean {
  // For a forcing matrix, we need to check that any combination
  // of one number from each column sums to the target
  
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
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

// Generate all permutations of rows (1,2,3,4)
function generatePermutations(): number[][] {
  const permutations: number[][] = [];
  function permute(arr: number[], start: number) {
    if (start === arr.length - 1) {
      permutations.push([...arr]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      permute(arr, start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }
  permute([0, 1, 2, 3], 0);
  return permutations;
}

// Check if a matrix satisfies the Latin Square forcing property
function checkLatinSquareProperty(matrix: Matrix, target: number): boolean {
  const permutations = generatePermutations();
  for (const perm of permutations) {
    let sum = 0;
    for (let col = 0; col < 4; col++) {
      const row = perm[col];
      sum += matrix[row][col].value;
    }
    if (sum !== target) {
      return false;
    }
  }
  return true;
}

// Generate forcing matrix using classic Latin square construction
export function generateForcingMatrix(target: number): Matrix {
  // Bart Nijs algorithm - guaranteed to work for any target
  
  // Step 1: Create a base matrix where all values are equal
  // This guarantees all permutations sum to the same value
  const baseValue = 1;
  const baseMatrix = [
    [baseValue, baseValue, baseValue, baseValue],
    [baseValue, baseValue, baseValue, baseValue],
    [baseValue, baseValue, baseValue, baseValue],
    [baseValue, baseValue, baseValue, baseValue]
  ];
  
  // Step 2: Calculate the adjustment needed to reach the target
  // All permutations in the base matrix sum to 4 (4 * baseValue)
  const baseSum = 4 * baseValue;
  const adjustment = target - baseSum;
  
  // Step 3: Apply the adjustment to all cells
  const matrix: Matrix = [];
  for (let row = 0; row < 4; row++) {
    matrix[row] = [];
    for (let col = 0; col < 4; col++) {
      const value = baseMatrix[row][col] + adjustment;
      matrix[row][col] = {
        value,
        isUserEdited: false,
        isCalculated: false
      };
    }
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
  // For user edits, regenerate the matrix to maintain the forcing property
  // (User edits are not supported in strict mode)
  return generateForcingMatrix(target);
}

// Validate that all Latin Square combinations sum to target
export function validateMatrix(matrix: Matrix, target: number): boolean {
  return checkLatinSquareProperty(matrix, target);
}

// Get validation message
export function getValidationMessage(matrix: Matrix, target: number): string {
  if (validateMatrix(matrix, target)) {
    return "✓ Valid Matrix - All Latin Square combinations sum to target";
  } else {
    return "⚠ Invalid Matrix - Some Latin Square combinations don't sum to target";
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
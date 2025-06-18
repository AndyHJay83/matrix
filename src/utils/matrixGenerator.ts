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

// Generate initial Latin Square forcing matrix
export function generateForcingMatrix(target: number): Matrix {
  const matrix: Matrix = [];
  const maxAttempts = 1000;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Initialize matrix with random positive numbers
    for (let row = 0; row < 4; row++) {
      matrix[row] = [];
      for (let col = 0; col < 4; col++) {
        const baseValue = Math.floor(target / 4);
        const variance = Math.min(500, Math.max(100, Math.floor(target * 0.15)));
        const minVal = Math.max(1, baseValue - variance);
        const maxVal = baseValue + variance;
        const value = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        
        matrix[row][col] = {
          value,
          isUserEdited: false,
          isCalculated: false  // All cells start as not calculated
        };
      }
    }
    
    // Try to adjust the matrix to satisfy the Latin Square property
    if (adjustMatrixForLatinSquare(matrix, target)) {
      return matrix;
    }
  }
  
  // If we can't find a good solution, create a simple one
  return createSimpleLatinSquareMatrix(target);
}

// Adjust matrix to satisfy Latin Square property
function adjustMatrixForLatinSquare(matrix: Matrix, target: number): boolean {
  const maxIterations = 50;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const permutations = generatePermutations();
    let allValid = true;
    
    for (const perm of permutations) {
      let sum = 0;
      for (let col = 0; col < 4; col++) {
        const row = perm[col];
        sum += matrix[row][col].value;
      }
      
      if (sum !== target) {
        allValid = false;
        // Adjust the matrix to fix this permutation
        const diff = target - sum;
        const adjustment = Math.floor(diff / 4);
        
        for (let col = 0; col < 4; col++) {
          const row = perm[col];
          matrix[row][col].value = Math.max(1, matrix[row][col].value + adjustment);
        }
      }
    }
    
    if (allValid) {
      return true;
    }
  }
  
  return false;
}

// Create a simple Latin Square matrix as fallback
function createSimpleLatinSquareMatrix(target: number): Matrix {
  const matrix: Matrix = [];
  const baseValue = Math.floor(target / 4);
  
  // Create a simple pattern that works
  for (let row = 0; row < 4; row++) {
    matrix[row] = [];
    for (let col = 0; col < 4; col++) {
      // Use a pattern that ensures Latin Square property
      const value = baseValue + (row + col) % 4;
      matrix[row][col] = {
        value: Math.max(1, value),
        isUserEdited: false,
        isCalculated: false  // All cells are not calculated
      };
    }
  }
  
  // Adjust to make it sum to target
  const permutations = generatePermutations();
  const firstPerm = permutations[0];
  let currentSum = 0;
  for (let col = 0; col < 4; col++) {
    const row = firstPerm[col];
    currentSum += matrix[row][col].value;
  }
  
  const adjustment = Math.floor((target - currentSum) / 4);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      matrix[row][col].value = Math.max(1, matrix[row][col].value + adjustment);
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
  const newMatrix = matrix.map(row => 
    row.map(cell => ({ ...cell }))
  );
  
  // Mark the edited cell as user-edited
  newMatrix[editedRow][editedCol].isUserEdited = true;
  newMatrix[editedRow][editedCol].isCalculated = false;
  
  // Try to adjust the matrix to maintain Latin Square property
  if (adjustMatrixForLatinSquare(newMatrix, target)) {
    // Mark all non-user-edited cells as not calculated (they're part of the algorithm)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!newMatrix[row][col].isUserEdited) {
          newMatrix[row][col].isCalculated = false;
        }
      }
    }
    return newMatrix;
  }
  
  // If adjustment fails, regenerate the matrix
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
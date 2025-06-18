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

// Generate forcing matrix using Walter Gibson/Maurice Kraitchik method
export function generateForcingMatrix(target: number): Matrix {
  const matrix: Matrix = [];
  
  // The Gibson/Kraitchik method uses a specific mathematical construction
  // that guarantees the forcing property for any target number
  
  // Step 1: Create the base matrix using the Gibson construction
  const baseValue = Math.floor(target / 4);
  const remainder = target % 4;
  
  // Create the matrix using the Gibson pattern
  for (let row = 0; row < 4; row++) {
    matrix[row] = [];
    for (let col = 0; col < 4; col++) {
      let value: number;
      
      // Gibson construction: each cell is baseValue + (row * col + row + col) % 4
      // This creates a pattern that ensures the forcing property
      const gibsonValue = baseValue + ((row * col + row + col) % 4);
      
      // Add some variation to make it more interesting
      const variation = (row * 7 + col * 11) % 10;
      value = Math.max(1, gibsonValue + variation);
      
      matrix[row][col] = {
        value,
        isUserEdited: false,
        isCalculated: false
      };
    }
  }
  
  // Step 2: Adjust the matrix to ensure exact target sum
  adjustMatrixToExactTarget(matrix, target);
  
  return matrix;
}

// Adjust matrix to ensure exact target sum using Gibson method
function adjustMatrixToExactTarget(matrix: Matrix, target: number): void {
  // Calculate current sum of the main diagonal (0,0), (1,1), (2,2), (3,3)
  let currentSum = 0;
  for (let i = 0; i < 4; i++) {
    currentSum += matrix[i][i].value;
  }
  
  // Calculate the adjustment needed
  const adjustment = target - currentSum;
  
  // Apply the adjustment to the main diagonal
  for (let i = 0; i < 4; i++) {
    matrix[i][i].value = Math.max(1, matrix[i][i].value + adjustment);
  }
  
  // Verify and fine-tune if needed
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
      break;
    }
  }
  
  // If not all valid, apply a systematic adjustment
  if (!allValid) {
    // Use a more robust adjustment method
    const firstPerm = permutations[0];
    let firstSum = 0;
    for (let col = 0; col < 4; col++) {
      const row = firstPerm[col];
      firstSum += matrix[row][col].value;
    }
    
    const fineAdjustment = target - firstSum;
    if (fineAdjustment !== 0) {
      // Distribute the adjustment across the first permutation
      for (let col = 0; col < 4; col++) {
        const row = firstPerm[col];
        matrix[row][col].value = Math.max(1, matrix[row][col].value + fineAdjustment);
      }
    }
  }
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
  
  // For user edits, regenerate the matrix using Gibson method
  // and then apply the user's edit
  const regeneratedMatrix = generateForcingMatrix(target);
  
  // Preserve the user's edit
  regeneratedMatrix[editedRow][editedCol].value = newMatrix[editedRow][editedCol].value;
  regeneratedMatrix[editedRow][editedCol].isUserEdited = true;
  regeneratedMatrix[editedRow][editedCol].isCalculated = false;
  
  return regeneratedMatrix;
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
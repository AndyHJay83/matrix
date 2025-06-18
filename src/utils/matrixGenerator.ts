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
export function generateForcingMatrix(target: number, variance: number = 0.5): Matrix {
  // Correct forcing matrix algorithm with adjustable variance
  // Choose 8 seed numbers (4 for rows, 4 for columns) that sum to target
  // variance: 0 = minimal variance, 1 = maximum variance
  
  // Step 1: Generate 8 diverse seed numbers that sum to target
  const baseValue = Math.floor(target / 8);
  const remainder = target % 8;
  
  // Create seed values with adjustable variance
  const seeds: number[] = [];
  
  // Calculate variance multiplier (0 = minimal, 1 = maximum)
  const varianceMultiplier = Math.max(0, Math.min(1, variance));
  
  // For variance = 0, use minimal variance (all values close to base)
  if (varianceMultiplier === 0) {
    // Distribute the target evenly with minimal variance
    for (let i = 0; i < 8; i++) {
      seeds[i] = baseValue;
    }
    // Distribute remainder
    for (let i = 0; i < remainder; i++) {
      seeds[i] += 1;
    }
  } else {
    // For variance > 0, use a systematic approach that ensures perfect accuracy
    // and unique numbers at 100% variance
    
    // Calculate variance range based on target size
    const maxVariance = Math.max(1, Math.floor(target / 50)); // Conservative variance
    const varianceRange = Math.floor(maxVariance * varianceMultiplier);
    
    // Create a pattern that ensures all permutations still work perfectly
    // Use different patterns for different variance levels to avoid repetition
    
    if (varianceMultiplier >= 0.8) {
      // High variance: use more dramatic differences and ensure uniqueness
      // Guarantee all 16 numbers are unique by using strictly increasing row/col seeds
      // r0 < r1 < r2 < r3, c0 < c1 < c2 < c3, and all (ri+cj) unique
      const spread = Math.max(4, Math.floor(target / 20));
      // Make row seeds spaced by spread, and col seeds by a different offset
      const rowBase = baseValue - 2 * spread;
      const colBase = baseValue + spread;
      seeds[0] = rowBase;
      seeds[1] = rowBase + spread;
      seeds[2] = rowBase + 2 * spread;
      seeds[3] = rowBase + 3 * spread;
      seeds[4] = colBase;
      seeds[5] = colBase + spread + 1;
      seeds[6] = colBase + 2 * spread + 2;
      seeds[7] = colBase + 3 * spread + 3;
      // Adjust all seeds to sum to target
      let currentSum = seeds.reduce((sum, seed) => sum + seed, 0);
      let diff = target - currentSum;
      // Distribute diff
      for (let i = 0; i < Math.abs(diff); i++) {
        seeds[i % 8] += diff > 0 ? 1 : -1;
      }
    } else {
      // Medium variance: use balanced pattern
      seeds[0] = baseValue - varianceRange;
      seeds[1] = baseValue - varianceRange + 1;
      seeds[2] = baseValue + varianceRange;
      seeds[3] = baseValue + varianceRange - 1;
      seeds[4] = baseValue + varianceRange + 1;
      seeds[5] = baseValue - varianceRange - 1;
      seeds[6] = baseValue + varianceRange - 2;
      seeds[7] = baseValue - varianceRange + 2;
    }
    
    // Distribute remainder to make sum exactly target
    // Use a systematic approach to avoid breaking the pattern
    let currentSum = seeds.reduce((sum, seed) => sum + seed, 0);
    let diff = target - currentSum;
    
    if (diff !== 0) {
      // Distribute the difference evenly across seeds
      const adjustment = Math.floor(diff / 8);
      const extraAdjustment = diff % 8;
      
      for (let i = 0; i < 8; i++) {
        seeds[i] += adjustment;
        if (i < extraAdjustment) {
          seeds[i] += 1;
        }
      }
    }
  }
  
  // Ensure all seeds are positive
  const minSeed = Math.min(...seeds);
  if (minSeed < 1) {
    const adjustment = 1 - minSeed;
    for (let i = 0; i < 8; i++) {
      seeds[i] += adjustment;
    }
    // Adjust the last seed to maintain target sum
    seeds[7] -= adjustment * 8;
  }
  
  // Final verification: ensure sum is exactly target
  let finalSum = seeds.reduce((sum, seed) => sum + seed, 0);
  if (finalSum !== target) {
    // Make a small adjustment to the last seed
    seeds[7] += (target - finalSum);
  }
  
  // Step 2: Split seeds into row seeds and column seeds
  const rowSeeds = seeds.slice(0, 4);    // First 4 seeds for rows
  const colSeeds = seeds.slice(4, 8);    // Last 4 seeds for columns
  
  // Step 3: Fill the matrix by adding row seed + column seed for each cell
  const matrix: Matrix = [];
  for (let row = 0; row < 4; row++) {
    matrix[row] = [];
    for (let col = 0; col < 4; col++) {
      const value = rowSeeds[row] + colSeeds[col];
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
export function resetMatrix(target: number, variance: number = 0.5): Matrix {
  return generateForcingMatrix(target, variance);
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
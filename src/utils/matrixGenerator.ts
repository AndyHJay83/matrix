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
      // Bart-style high variance: organic-looking numbers with dramatic variance
      // Use "messy" seed offsets and allow negative values for dramatic effect
      
      // Calculate base variance based on target size
      let baseVariance = Math.floor(target / 20); // conservative base
      if (target >= 1000000) { // 7 digits
        baseVariance = Math.floor(target / 8);
      } else if (target >= 100000) { // 6 digits
        baseVariance = Math.floor(target / 12);
      } else if (target >= 5000) {
        baseVariance = Math.floor(target / 15);
      } else if (target >= 1000) {
        baseVariance = Math.floor(target / 18);
      }
      
      // Create "organic" seed offsets (not clean multiples)
      const organicOffsets = [
        Math.floor(baseVariance * 0.8),      // 0.8x
        Math.floor(baseVariance * -1.2),     // -1.2x (negative for drama)
        Math.floor(baseVariance * 0.3),      // 0.3x
        Math.floor(baseVariance * 1.7),      // 1.7x
        Math.floor(baseVariance * 1.1),      // 1.1x
        Math.floor(baseVariance * -0.9),     // -0.9x (negative)
        Math.floor(baseVariance * 0.6),      // 0.6x
        Math.floor(baseVariance * 1.4)       // 1.4x
      ];
      
      // Add some "jitter" to make numbers more organic
      const jitter = Math.max(1, Math.floor(baseVariance * 0.1));
      for (let i = 0; i < 8; i++) {
        organicOffsets[i] += Math.floor(Math.random() * jitter) - Math.floor(jitter / 2);
      }
      
      // Create seeds with organic offsets
      for (let i = 0; i < 8; i++) {
        seeds[i] = baseValue + organicOffsets[i];
      }
      
      // Adjust to sum exactly to target
      let currentSum = seeds.reduce((sum, seed) => sum + seed, 0);
      let diff = target - currentSum;
      
      // Distribute the difference organically (not evenly)
      const distribution = [0.3, 0.2, 0.15, 0.1, 0.1, 0.05, 0.05, 0.05]; // weighted distribution
      for (let i = 0; i < 8; i++) {
        seeds[i] += Math.floor(diff * distribution[i]);
      }
      
      // Final adjustment to ensure exact sum
      currentSum = seeds.reduce((sum, seed) => sum + seed, 0);
      seeds[7] += (target - currentSum);
      
      // Ensure all matrix values are positive (but allow negative seeds)
      const rowSeeds = seeds.slice(0, 4);
      const colSeeds = seeds.slice(4, 8);
      let minValue = Math.min(...rowSeeds.map(r => Math.min(...colSeeds.map(c => r + c))));
      
      if (minValue < 1) {
        // Shift all seeds up to make minimum value 1
        const shift = 1 - minValue;
        for (let i = 0; i < 4; i++) {
          rowSeeds[i] += shift;
        }
        for (let i = 0; i < 4; i++) {
          colSeeds[i] += shift;
        }
        // Adjust last colSeed to maintain sum
        const newSeeds = [...rowSeeds, ...colSeeds];
        const newSum = newSeeds.reduce((a, b) => a + b, 0);
        colSeeds[3] += (target - newSum);
        // Update seeds array
        for (let i = 0; i < 4; i++) seeds[i] = rowSeeds[i];
        for (let i = 0; i < 4; i++) seeds[4 + i] = colSeeds[i];
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
  editedCol: number,
  newValue: number,
  userEdits: { [col: number]: { row: number, value: number } }
): Matrix {
  // If fewer than 4 columns are edited, just update the cell and return
  if (Object.keys(userEdits).length < 4) {
    const newMatrix: Matrix = matrix.map((row, r) =>
      row.map((cell, c) =>
        r === editedRow && c === editedCol
          ? { ...cell, value: newValue, isUserEdited: true }
          : cell
      )
    );
    return newMatrix;
  }

  // Otherwise, use the 4 user-edited cells (one per column) as constraints
  // Let userEdits[col] = { row, value }
  // We want: rowSeed[row] + colSeed[col] = value (for each col)
  // And sum(rowSeeds) + sum(colSeeds) = target

  // Set up the system
  // Let x0,x1,x2,x3 = rowSeeds, y0,y1,y2,y3 = colSeeds
  // For each col: x[row] + y[col] = value
  // 8 unknowns, 5 equations (4 constraints + sum)

  // We'll solve by:
  // 1. Set y0 = 0 (arbitrary, as only differences matter)
  // 2. Solve for x[row] and y[col] using the constraints
  // 3. Adjust all seeds so that sum = target

  const rowSeeds = [0, 0, 0, 0];
  const colSeeds = [0, 0, 0, 0];
  const usedRows = [false, false, false, false];

  // Step 1: Set y0 = 0
  colSeeds[0] = 0;
  // Find which row is edited in col 0
  const edit0 = userEdits[0];
  rowSeeds[edit0.row] = edit0.value;
  usedRows[edit0.row] = true;

  // Step 2: For other columns, solve for y[col] and x[row]
  for (let col = 1; col < 4; col++) {
    const { row, value } = userEdits[col];
    colSeeds[col] = value - rowSeeds[row];
    usedRows[row] = true;
  }

  // Step 3: For any row not edited, solve for x[row] using y0 = 0
  for (let row = 0; row < 4; row++) {
    if (!usedRows[row]) {
      // Find which col this row is edited in
      let found = false;
      for (let col = 0; col < 4; col++) {
        if (userEdits[col] && userEdits[col].row === row) {
          rowSeeds[row] = userEdits[col].value - colSeeds[col];
          found = true;
          break;
        }
      }
      if (!found) {
        // Not edited, leave as 0 for now
      }
    }
  }

  // Step 4: Adjust all seeds so that sum(rowSeeds) + sum(colSeeds) = target
  const totalSeeds = rowSeeds.reduce((a, b) => a + b, 0) + colSeeds.reduce((a, b) => a + b, 0);
  const diff = target - totalSeeds;
  // Distribute diff evenly
  for (let i = 0; i < 4; i++) {
    rowSeeds[i] += Math.floor(diff / 8);
    colSeeds[i] += Math.floor(diff / 8);
  }
  for (let i = 0; i < diff % 8; i++) {
    if (i < 4) rowSeeds[i] += 1;
    else colSeeds[i - 4] += 1;
  }

  // Step 5: Build the new matrix
  const newMatrix: Matrix = [];
  for (let row = 0; row < 4; row++) {
    newMatrix[row] = [];
    for (let col = 0; col < 4; col++) {
      const isUserEdited = userEdits[col] && userEdits[col].row === row;
      const value = rowSeeds[row] + colSeeds[col];
      newMatrix[row][col] = {
        value,
        isUserEdited,
        isCalculated: !isUserEdited
      };
    }
  }
  return newMatrix;
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
import { generateForcingMatrix, validateMatrix } from './src/utils/matrixGenerator';

// Test dramatic variance in generated matrices
const targets = [50, 100, 150];

for (const target of targets) {
  console.log(`\n=== Target: ${target} ===`);
  const matrix = generateForcingMatrix(target);
  
  console.log('Matrix:');
  matrix.forEach((row, i) => {
    console.log(`Row ${i}: ${row.map(cell => cell.value.toString().padStart(3)).join(' ')}`);
  });
  
  // Show the range of values
  const allValues = matrix.flat().map(cell => cell.value);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const uniqueValues = [...new Set(allValues)].sort((a, b) => a - b);
  
  console.log(`Value range: ${min} to ${max} (${max - min + 1} different values)`);
  console.log(`Unique values: [${uniqueValues.join(', ')}]`);
  console.log(`Range width: ${max - min}`);
  
  const isValid = validateMatrix(matrix, target);
  console.log(`Valid: ${isValid ? '✓' : '✗'}`);
} 
import { generateForcingMatrix, validateMatrix } from './src/utils/matrixGenerator';

// Test the fix for target 9743
const target = 9743;
const variance = 1.0; // 100% variance

console.log(`Testing matrix generation for target: ${target}, variance: ${variance}`);
console.log('=' .repeat(50));

const matrix = generateForcingMatrix(target, variance);

console.log('Generated Matrix:');
matrix.forEach((row, i) => {
  console.log(`Row ${i + 1}: ${row.map(cell => cell.value.toString().padStart(4)).join(' ')}`);
});

console.log('\nChecking all permutations...');
const isValid = validateMatrix(matrix, target);
console.log(`Matrix is valid: ${isValid}`);

// Test specific diagonal mentioned by user
const diagonal = [matrix[0][0].value, matrix[1][1].value, matrix[2][2].value, matrix[3][3].value];
const diagonalSum = diagonal.reduce((sum, val) => sum + val, 0);
console.log(`\nDiagonal (0,0), (1,1), (2,2), (3,3): ${diagonal.join(' + ')} = ${diagonalSum}`);
console.log(`Expected: ${target}, Got: ${diagonalSum}, Difference: ${target - diagonalSum}`);

// Check for unique numbers
const allValues = matrix.flat().map(cell => cell.value);
const uniqueValues = new Set(allValues);
console.log(`\nTotal values: ${allValues.length}, Unique values: ${uniqueValues.size}`);
console.log(`All numbers are unique: ${allValues.length === uniqueValues.size}`);

if (allValues.length !== uniqueValues.size) {
  console.log('Repeated values:');
  const counts = new Map<number, number>();
  allValues.forEach(val => {
    counts.set(val, (counts.get(val) || 0) + 1);
  });
  counts.forEach((count, val) => {
    if (count > 1) {
      console.log(`  ${val} appears ${count} times`);
    }
  });
}

// Test for small target, check for negative or zero values
const smallTarget = 100;
const smallMatrix = generateForcingMatrix(smallTarget, 1.0);
const smallValues = smallMatrix.flat().map(cell => cell.value);
const hasNegativeOrZero = smallValues.some(v => v < 1);
console.log(`\nTesting small target (${smallTarget}) at 100% variance:`);
smallMatrix.forEach((row, i) => {
  console.log(`Row ${i + 1}: ${row.map(cell => cell.value.toString().padStart(4)).join(' ')}`);
});
console.log(`Any negative or zero values: ${hasNegativeOrZero}`); 
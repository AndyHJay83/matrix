import { generateForcingMatrix, validateMatrix } from './src/utils/matrixGenerator';

// Test the new Bart-style algorithm
const target = 9999999;
const variance = 1.0; // 100% variance

console.log(`Testing Bart-style matrix generation for target: ${target}, variance: ${variance}`);
console.log('=' .repeat(60));

const matrix = generateForcingMatrix(target, variance);

console.log('Generated Matrix:');
matrix.forEach((row, i) => {
  console.log(`Row ${i + 1}: ${row.map(cell => cell.value.toString().padStart(8)).join(' ')}`);
});

console.log('\nChecking all permutations...');
const isValid = validateMatrix(matrix, target);
console.log(`Matrix is valid: ${isValid}`);

// Test specific diagonal
const diagonal = [matrix[0][0].value, matrix[1][1].value, matrix[2][2].value, matrix[3][3].value];
const diagonalSum = diagonal.reduce((sum, val) => sum + val, 0);
console.log(`\nDiagonal (0,0), (1,1), (2,2), (3,3): ${diagonal.join(' + ')} = ${diagonalSum}`);
console.log(`Expected: ${target}, Got: ${diagonalSum}, Difference: ${target - diagonalSum}`);

// Check for unique numbers
const allValues = matrix.flat().map(cell => cell.value);
const uniqueValues = new Set(allValues);
console.log(`\nTotal values: ${allValues.length}, Unique values: ${uniqueValues.size}`);
console.log(`All numbers are unique: ${allValues.length === uniqueValues.size}`);

// Analyze the "organic" nature
const minVal = Math.min(...allValues);
const maxVal = Math.max(...allValues);
const range = maxVal - minVal;
const rangePercent = ((range / target) * 100).toFixed(1);
console.log(`\nValue range: ${minVal} to ${maxVal} (range: ${range}, ${rangePercent}% of target)`);

// Check for "messy" numbers (not clean multiples)
const hasMessyNumbers = allValues.some(val => val % 1000 !== 0);
console.log(`Has "messy" numbers (not clean multiples): ${hasMessyNumbers}`);

// Compare with Bart's matrix
console.log('\n' + '='.repeat(60));
console.log('COMPARISON WITH BART\'S MATRIX:');
console.log('='.repeat(60));
console.log('Bart\'s matrix for 9,999,999:');
console.log('5110809 2090403 1554850 1861293');
console.log('4124495 1104089  568536  874979');
console.log('4820953 1800547 1264994 1571437');
console.log('5769623 2749217 2213664 2520107');

// Test different target sizes
console.log('\n' + '='.repeat(60));
console.log('TESTING DIFFERENT TARGET SIZES WITH BART-STYLE:');
console.log('='.repeat(60));

const testTargets = [1000, 5000, 15000, 123456, 1234567];
testTargets.forEach(testTarget => {
  console.log(`\nTarget: ${testTarget} (${testTarget.toString().length} digits)`);
  const testMatrix = generateForcingMatrix(testTarget, 1.0);
  const testValues = testMatrix.flat().map(cell => cell.value);
  const minVal = Math.min(...testValues);
  const maxVal = Math.max(...testValues);
  const range = maxVal - minVal;
  const rangePercent = ((range / testTarget) * 100).toFixed(1);
  
  console.log(`Value range: ${minVal} to ${maxVal} (range: ${range}, ${rangePercent}% of target)`);
  console.log('Matrix:');
  testMatrix.forEach((row, i) => {
    console.log(`  ${row.map(cell => cell.value.toString().padStart(6)).join(' ')}`);
  });
  
  // Verify it's still valid
  const testValid = validateMatrix(testMatrix, testTarget);
  console.log(`Valid: ${testValid}`);
}); 
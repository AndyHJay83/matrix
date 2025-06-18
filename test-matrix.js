// Simple test to verify matrix generation
import { generateForcingMatrix, validateMatrix } from './dist/utils/matrixGenerator.js';

console.log('Testing matrix generation...\n');

// Test multiple targets
const targets = [50, 100, 150, 200, 250];

for (const target of targets) {
  console.log(`Testing target: ${target}`);
  
  // Generate matrix
  const matrix = generateForcingMatrix(target);
  
  // Validate matrix
  const isValid = validateMatrix(matrix, target);
  
  console.log(`Valid: ${isValid ? '✓' : '✗'}`);
  
  if (isValid) {
    console.log('Matrix:');
    matrix.forEach((row, i) => {
      console.log(`Row ${i}: ${row.map(cell => cell.value.toString().padStart(3)).join(' ')}`);
    });
  } else {
    console.log('❌ Matrix is invalid!');
  }
  
  console.log('');
}

console.log('Test completed!'); 
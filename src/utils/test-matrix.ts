import { generateForcingMatrix, validateMatrix } from './matrixGenerator';

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

// Helper to generate all permutations of [0,1,2,3]
function generatePermutations(): number[][] {
  const results: number[][] = [];
  function permute(arr: number[], m: number[] = []) {
    if (arr.length === 0) {
      results.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        permute(arr.slice(0, i).concat(arr.slice(i + 1)), m.concat(arr[i]));
      }
    }
  }
  permute([0, 1, 2, 3]);
  return results;
}

const target = 50;
console.log(`Testing target: ${target}`);
const matrix = generateForcingMatrix(target);
console.log('Matrix:');
matrix.forEach((row, i) => {
  console.log(`Row ${i}: ${row.map(cell => cell.value.toString().padStart(3)).join(' ')}`);
});

const perms = generatePermutations();
console.log('\nPermutation sums:');
perms.forEach((perm, idx) => {
  // Correct logic: for each col, pick row perm[col]
  const sum = perm.reduce((acc, row, col) => acc + matrix[row][col].value, 0);
  console.log(`Perm ${idx + 1}: [${perm.join(', ')}] sum = ${sum}`);
});

const isValid = validateMatrix(matrix, target);
console.log(`\nValid: ${isValid ? '✓' : '✗'}`);

console.log('Test completed!'); 
// Analyze Bart's matrix for target 9,999,999
const bartMatrix = [
  [5110809, 2090403, 1554850, 1861293],
  [4124495, 1104089, 568536, 874979],
  [4820953, 1800547, 1264994, 1571437],
  [5769623, 2749217, 2213664, 2520107]
];

console.log("Bart's Matrix Analysis:");
console.log("=" .repeat(50));

// Display matrix
console.log("Matrix:");
bartMatrix.forEach((row, i) => {
  console.log(`Row ${i + 1}: ${row.map(val => val.toString().padStart(8)).join(' ')}`);
});

// Check all permutations
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

const permutations = generatePermutations();
const target = 9999999;

console.log(`\nChecking all ${permutations.length} permutations for target ${target}:`);

let allValid = true;
const results: number[] = [];

permutations.forEach((perm, index) => {
  let sum = 0;
  for (let col = 0; col < 4; col++) {
    const row = perm[col];
    sum += bartMatrix[row][col];
  }
  results.push(sum);
  
  if (sum !== target) {
    allValid = false;
    console.log(`❌ Permutation ${index + 1}: ${perm.join(',')} = ${sum} (should be ${target})`);
  }
});

console.log(`\nAll permutations valid: ${allValid}`);

if (allValid) {
  console.log("✅ This is a valid forcing matrix!");
} else {
  console.log("❌ This is NOT a valid forcing matrix!");
}

// Analyze the pattern
console.log("\nPattern Analysis:");
console.log("=" .repeat(30));

// Check if it's a row + column seed pattern
console.log("Testing row + column seed pattern:");
const rowSums = bartMatrix.map(row => row.reduce((a, b) => a + b, 0));
const colSums = [0, 1, 2, 3].map(col => bartMatrix.reduce((sum, row) => sum + row[col], 0));

console.log("Row sums:", rowSums);
console.log("Column sums:", colSums);

// Try to extract row and column seeds
const rowSeeds: number[] = [];
const colSeeds: number[] = [];

// For a 4x4 matrix, if it's row + col pattern:
// matrix[i][j] = rowSeed[i] + colSeed[j]
// So: rowSeed[i] = matrix[i][0] - colSeed[0]
// And: colSeed[j] = matrix[0][j] - rowSeed[0]

// Let's assume rowSeed[0] = 0, then:
const assumedRowSeed0 = 0;
const colSeed0 = bartMatrix[0][0] - assumedRowSeed0;

for (let i = 0; i < 4; i++) {
  rowSeeds[i] = bartMatrix[i][0] - colSeed0;
}

for (let j = 0; j < 4; j++) {
  colSeeds[j] = bartMatrix[0][j] - rowSeeds[0];
}

console.log("\nExtracted seeds (assuming rowSeed[0] = 0):");
console.log("Row seeds:", rowSeeds);
console.log("Column seeds:", colSeeds);

// Verify the pattern
console.log("\nVerifying pattern:");
let patternValid = true;
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    const expected = rowSeeds[i] + colSeeds[j];
    const actual = bartMatrix[i][j];
    if (expected !== actual) {
      patternValid = false;
      console.log(`❌ [${i}][${j}]: expected ${expected}, got ${actual}`);
    }
  }
}

console.log(`Pattern verification: ${patternValid ? "✅ Valid" : "❌ Invalid"}`);

if (patternValid) {
  console.log("\nSeed sum:", rowSeeds.reduce((a, b) => a + b, 0) + colSeeds.reduce((a, b) => a + b, 0));
  console.log("Target:", target);
} 
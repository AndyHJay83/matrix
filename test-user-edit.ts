import { generateForcingMatrix, recalculateMatrix, validateMatrix } from './src/utils/matrixGenerator';

// Test user editing feature
console.log('Testing User Editing Feature');
console.log('=' .repeat(40));

// Generate initial matrix
const target = 1000;
const initialMatrix = generateForcingMatrix(target, 0.5);

console.log('Initial Matrix:');
initialMatrix.forEach((row, i) => {
  console.log(`Row ${i + 1}: ${row.map(cell => cell.value.toString().padStart(4)).join(' ')}`);
});

// Test editing a cell
const editedRow = 0;
const editedCol = 0;
const newValue = 500;

console.log(`\nEditing cell [${editedRow}][${editedCol}] to ${newValue}...`);

const editedMatrix = recalculateMatrix(initialMatrix, target, editedRow, editedCol, newValue);

console.log('\nEdited Matrix:');
editedMatrix.forEach((row, i) => {
  console.log(`Row ${i + 1}: ${row.map(cell => {
    const value = cell.value.toString().padStart(4);
    return cell.isUserEdited ? `[${value}]` : value;
  }).join(' ')}`);
});

// Verify the edited cell
const editedCell = editedMatrix[editedRow][editedCol];
console.log(`\nEdited cell value: ${editedCell.value} (expected: ${newValue})`);
console.log(`Is user edited: ${editedCell.isUserEdited}`);

// Verify the matrix is still valid
const isValid = validateMatrix(editedMatrix, target);
console.log(`Matrix is valid: ${isValid}`);

// Test a diagonal to make sure it sums to target
const diagonal = [editedMatrix[0][0].value, editedMatrix[1][1].value, editedMatrix[2][2].value, editedMatrix[3][3].value];
const diagonalSum = diagonal.reduce((sum, val) => sum + val, 0);
console.log(`\nDiagonal sum: ${diagonal.join(' + ')} = ${diagonalSum} (target: ${target})`);
console.log(`Diagonal is correct: ${diagonalSum === target}`); 
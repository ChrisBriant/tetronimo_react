/**
 * Selects a specified number of unique random elements from an array.
 * * @param {Array<T>} array - The source array.
 * @param {number} n - The number of random elements to select.
 * @returns {Array<T>} A new array containing 'n' random, unique elements.
 * @template T
 */
function selectRandomUnique(array, n) {
  // 1. Create a shallow copy of the array to modify without affecting the original.
  const workingArray = [...array];
  const selectedElements = [];
  
  // 2. Determine the actual number to select, ensuring it doesn't exceed the array length.
  const actualCount = Math.min(n, workingArray.length);

  // 3. Loop 'actualCount' times to pick unique elements.
  for (let i = 0; i < actualCount; i++) {
    // Generate a random index based on the remaining length of the working array.
    const randomIndex = Math.floor(Math.random() * workingArray.length);
    
    // Add the element at the random index to the result set.
    selectedElements.push(workingArray[randomIndex]);
    
    // Remove the element from the working array so it can't be selected again.
    workingArray.splice(randomIndex, 1);
  }

  return selectedElements;
}

export {selectRandomUnique};
// This file would contain more complex image processing logic in a full implementation
// For this MVP, we're using a simplified approach

/**
 * Combines multiple image layers into a single image
 * In a real implementation, this would use canvas to combine layers
 */
export const combineImageLayers = async (
  layerImages: string[]
): Promise<string> => {
  // In a real implementation, we would:
  // 1. Create a canvas element
  // 2. Draw each layer onto the canvas in order
  // 3. Convert the canvas to a data URL or blob
  
  // For this demo, we'll just return the first layer image
  return layerImages[0];
};

/**
 * Checks for uniqueness of generated combinations
 */
export const isUniqueCombination = (
  newCombination: number[],
  existingCombinations: number[][]
): boolean => {
  // Check if this exact combination already exists
  return !existingCombinations.some(combination => 
    combination.length === newCombination.length &&
    combination.every((value, index) => value === newCombination[index])
  );
};

/**
 * Generate a random combination of layer elements based on weights
 */
export const generateRandomCombination = (
  layerSizes: number[],
  weights: number[][]
): number[] => {
  return layerSizes.map((size, layerIndex) => {
    // Use weights to determine probability
    const layerWeights = weights[layerIndex] || Array(size).fill(100);
    
    // Calculate weightSum
    const weightSum = layerWeights.reduce((sum, weight) => sum + weight, 0);
    
    // Select random element based on weights
    let random = Math.random() * weightSum;
    let elementIndex = 0;
    
    while (random > 0 && elementIndex < layerWeights.length) {
      random -= layerWeights[elementIndex];
      if (random > 0) elementIndex++;
    }
    
    return elementIndex;
  });
};
export function generateFlatChunk(size: number) {
  // returns a list of block positions for a flat terrain
  const blocks: Array<[number, number, number]> = [];

  const half = Math.floor(size / 2);
  for (let x = -half; x <= half; x++) {
    for (let z = -half; z <= half; z++) {
      blocks.push([x, 0, z]); // ground layer
    }
  }

  return blocks;
}
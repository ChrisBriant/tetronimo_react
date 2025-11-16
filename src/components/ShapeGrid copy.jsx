import { useEffect, useRef, useContext } from "react";
import {Context as ShapeDataContext} from "../context/ShapeDataContext";

const ShapeGrid = () => {
  const {state:{selectedShape}} = useContext(ShapeDataContext);

  const canvasRef = useRef(null);
  const size = 10;
  const cellSize = 40; // adjust as needed

  const getWeightedRandom = () => {
    // 1 = common, 2 = uncommon, 3 = rare
    // weights: 1 -> 0.6, 2 -> 0.3, 3 -> 0.1 (example)
    const r = Math.random();
    if (r < 0.6) return 1;
    if (r < 0.9) return 2;
    return 3;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = size * cellSize;
    canvas.height = size * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const value = getWeightedRandom();

        // draw cell border
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // draw number
        ctx.fillText(
          value,
          x * cellSize + cellSize / 2,
          y * cellSize + cellSize / 2
        );
      }
    }
  }, []);

  console.log("MOUNTED", selectedShape);

  return (
    <div className="p-4">
      {selectedShape ? <p>{selectedShape.id}</p> : <p>No shape is selected</p>}
      <p className="mb-2 text-lg font-semibold">Draws a 10×10 grid with weighted random numbers.</p>
      <canvas ref={canvasRef} className="border border-gray-400 rounded" />
    </div>
  );
};

export default ShapeGrid;

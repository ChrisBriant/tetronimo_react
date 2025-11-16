import { useEffect, useRef, useContext, useState } from "react";
import { Context as ShapeDataContext } from "../context/ShapeDataContext";

const ShapeGrid = () => {
  const { state: { selectedShape } } = useContext(ShapeDataContext);

  const canvasRef = useRef(null);
  const size = 10;
  const cellSize = 40; // pixels

  // Store grid state: array of rows of { value, occupied }
  const [grid, setGrid] = useState([]);

  // Initialize the grid
  useEffect(() => {
    const newGrid = [];
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        const r = Math.random();
        const value = r < 0.6 ? 1 : r < 0.9 ? 2 : 3;
        row.push({ value, occupied: false });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
  }, []);

  // Draw the grid
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = size * cellSize;
    canvas.height = size * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        // cell border
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // fill if occupied
        if (cell.occupied) {
          ctx.fillStyle = "rgba(50, 50, 200, 0.5)";
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }

        // number
        ctx.fillStyle = "black";
        ctx.fillText(cell.value, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
      });
    });
  }, [grid]);

  // --- Handle placing shape ---
  const handleClick = (e) => {
    if (!selectedShape) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // mouse position relative to canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // compute snapped grid position
    const gx = Math.floor(mouseX / cellSize);
    const gy = Math.floor(mouseY / cellSize);

    // get shape dimensions
    const cells = selectedShape.cells || [[0, 0]];
    const shapeWidth = Math.max(...cells.map(c => c[0])) + 1;
    const shapeHeight = Math.max(...cells.map(c => c[1])) + 1;

    // check bounds
    if (gx + shapeWidth > size || gy + shapeHeight > size) return;

    // check if cells are free
    for (let [cx, cy] of cells) {
      const x = gx + cx;
      const y = gy + cy;
      if (grid[y][x].occupied) return; // cannot place, blocked
    }

    // calculate score and mark cells as occupied
    let score = 0;
    const newGrid = grid.map((row, y) =>
      row.map((cell, x) => {
        if (cells.some(([cx, cy]) => cx + gx === x && cy + gy === y)) {
          score += cell.value;
          return { ...cell, occupied: true };
        }
        return cell;
      })
    );

    setGrid(newGrid);
    console.log(`Placed shape ${selectedShape.id} at (${gx},${gy}) — Score: ${score}`);
  };

  return (
    <div className="p-4">
      {selectedShape ? <p>{selectedShape.id}</p> : <p>No shape is selected</p>}
      <p className="mb-2 text-lg font-semibold">
        Draws a 10×10 grid with weighted random numbers.
      </p>
      <canvas
        ref={canvasRef}
        className="border border-gray-400 rounded"
        onClick={handleClick}
      />
    </div>
  );
};

export default ShapeGrid;

import { useEffect, useRef, useContext, useState } from "react";
import { Context as ShapeDataContext } from "../context/ShapeDataContext";
import GhostShape from "./GhostShape"; // <-- you will create this

const ShapeGrid = () => {
  const {
    state: { selectedShape },
  } = useContext(ShapeDataContext);

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const size = 10;
  const cellSize = 40;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gridPos, setGridPos] = useState({ gx: 0, gy: 0 }); // snapped cell

  // -----------------------
  // Draw the number grid
  // -----------------------
  const getWeightedRandom = () => {
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
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.fillText(
          value,
          x * cellSize + cellSize / 2,
          y * cellSize + cellSize / 2
        );
      }
    }
  }, []);

  // -----------------------
  // Mouse move over grid
  // -----------------------
  const handleMouseMove = (e) => {
    if (!wrapperRef.current || !selectedShape) return;

    const bounds = wrapperRef.current.getBoundingClientRect();

    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    setMousePos({ x: mouseX, y: mouseY });

    // Snap to grid
    const gx = Math.floor(mouseX / cellSize);
    const gy = Math.floor(mouseY / cellSize);

    setGridPos({ gx, gy });
  };

  // -----------------------
  // Click to place shape
  // -----------------------
  const handleClick = () => {
    if (!selectedShape) return;

    console.log("Place shape at grid:", gridPos, selectedShape);

    // TODO: optional: draw shape on canvas here or call context
  };

  return (
    <div className="relative p-4">
      {/* Display text */}
      {selectedShape ? (
        <p>Selected shape: {selectedShape.id}</p>
      ) : (
        <p>No shape selected</p>
      )}

      <p className="mb-2 text-lg font-semibold">
        Draws a 10×10 grid with weighted random numbers.
      </p>

      {/* Wrapper to track mouse movement */}
      <div
        ref={wrapperRef}
        className={selectedShape ? "cursor-none relative" : "relative"}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{ width: size * cellSize, height: size * cellSize }}
      >
        {/* Canvas layer */}
        <canvas
          ref={canvasRef}
          className="border border-gray-400 rounded absolute top-0 left-0"
        />

        {/* Ghost shape overlay layer */}
        {selectedShape && (
          <GhostShape
            shape={selectedShape}
            x={gridPos.gx * cellSize}
            y={gridPos.gy * cellSize}
            cell={cellSize}
          />
        )}
      </div>
    </div>
  );
};

export default ShapeGrid;

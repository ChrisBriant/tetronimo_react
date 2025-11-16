import { useEffect, useRef, useContext, useState } from "react";
import { Context as ShapeDataContext } from "../context/ShapeDataContext";
import GhostShape from "./GhostShape";

const ShapeGrid = () => {
  const {
    state: { selectedShape },
  } = useContext(ShapeDataContext);

  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const size = 10;
  const cellSize = 40;

  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });

  // --- DRAW GRID ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = size * cellSize;
    canvas.height = size * cellSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const r = Math.random();
        const value = r < 0.6 ? 1 : r < 0.9 ? 2 : 3;

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

  // --- HANDLE MOUSE ---
  const handleMouseMove = (e) => {
    if (!selectedShape || !wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    // clamp to grid
    const shapeBox = selectedShape.getBoundingBox
      ? selectedShape.getBoundingBox()
      : { width: 1, height: 1 };

    let gx = Math.floor(mouseX / cellSize);
    let gy = Math.floor(mouseY / cellSize);

    gx = Math.max(0, Math.min(size - shapeBox.width, gx));
    gy = Math.max(0, Math.min(size - shapeBox.height, gy));

    setGhostPos({ x: gx * cellSize, y: gy * cellSize });
  };

  // --- HANDLE CLICK ---
  const handleClick = () => {
    if (!selectedShape) return;
    console.log("Placed shape:", selectedShape.id, "at", ghostPos);
    // TODO: draw on canvas or store in context
  };

  return (
    <div className="p-4">
      <p className="mb-2 text-lg font-semibold">
        Draws a 10×10 grid with weighted random numbers.
      </p>

      {/* Wrapper exactly same size as canvas */}
      <div
        ref={wrapperRef}
        className="relative"
        style={{
          width: size * cellSize,
          height: size * cellSize,
          display: "inline-block", // important inside flex
          cursor: selectedShape ? "none" : "default",
        }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="border border-gray-400 rounded block"
        />

        {/* Ghost shape overlay */}
        {selectedShape && (
          <GhostShape
            shape={selectedShape}
            x={ghostPos.x}
            y={ghostPos.y}
            cellSize={cellSize}
          />
        )}
      </div>
    </div>
  );
};

export default ShapeGrid;

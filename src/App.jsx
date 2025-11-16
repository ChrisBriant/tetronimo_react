import { useState, useEffect } from "react";
import "./App.css";
import ShapeSelector from "./components/ShapeSelector";
import ShapeGrid from "./components/ShapeGrid";
import GhostShape from "./components/GhostShape";
import { Context as ShapeDataContext } from "./context/ShapeDataContext";

function App() {
  const [selectedShape, setSelectedShape] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse globally
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Right-click rotation
  useEffect(() => {
    const rotateShape = (shape) => {
      const rotatedCells = shape.cells.map(([x, y]) => [y, -x]);
      const minX = Math.min(...rotatedCells.map(([x, _]) => x));
      const minY = Math.min(...rotatedCells.map(([_, y]) => y));
      const normalizedCells = rotatedCells.map(([x, y]) => [x - minX, y - minY]);
      return { ...shape, cells: normalizedCells };
    };

    const handleContextMenu = (e) => {
      if (!selectedShape) return;
      e.preventDefault(); // important to block browser menu
      setSelectedShape(rotateShape(selectedShape));
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, [selectedShape]);

  return (
    <ShapeDataContext.Provider value={{ state: { selectedShape }, setSelectedShape }}>
      <h1>Hello</h1>
      <div id="interactive-panel">
        <ShapeSelector />
        <ShapeGrid />
      </div>

      {/* Ghost shape overlay */}
      {selectedShape && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 999,
          }}
        >
          <GhostShape shape={selectedShape} x={mousePos.x} y={mousePos.y} cellSize={40} />
        </div>
      )}
    </ShapeDataContext.Provider>
  );
}

export default App;

import { useState, useEffect } from "react";
import "./App.css";
import ShapeGrid from "./components/ShapeGrid";
import ShapeSelector from "./components/ShapeSelector";
import GhostShape from "./components/GhostShape";
import { Context as ShapeDataContext } from "./context/ShapeDataContext";

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedShape, setSelectedShape] = useState(null);

  // Track mouse anywhere
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <ShapeDataContext.Provider value={{ state: { selectedShape }, setSelectedShape }}>
      <h1>Hello</h1>
      <div id="interactive-panel">
        <ShapeSelector />
        <ShapeGrid />
      </div>

      {/* Ghost shape rendered at top level */}
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
          <GhostShape
            shape={selectedShape}
            x={mousePos.x}
            y={mousePos.y}
            cellSize={40}
          />
        </div>
      )}
    </ShapeDataContext.Provider>
  );
}

export default App;

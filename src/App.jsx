import { useState, useEffect, useContext } from "react";
import "./App.css";
import ShapeSelector from "./components/ShapeSelector";
import MarketPlace from "./components/MarketPlace";
import ShapeGrid from "./components/ShapeGrid";
import GhostShape from "./components/GhostShape";
import { Context as ShapeDataContext } from "./context/ShapeDataContext";
import { Context as GameDataContext } from "./context/GameDataContext";
import { SHAPES } from "./shapes/shapeDefinitions";
import {selectRandomUnique} from "./utils/utils"; 
import Overlay from "./components/OverLay";

function App() {
  const [selectedShape, setSelectedShape] = useState(null);
  const { state: {currentPlayerTurn,players, grid, showOverlay},  setPlayer, setPlayerAvailableShapes, setOverlayComponent} = useContext(GameDataContext);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  //Initialise game settings
  useEffect(() => {
    setPlayer("player1");
    //Get random shapes
    const player2Shapes = selectRandomUnique(SHAPES,6);
    const player1Shapes = selectRandomUnique(SHAPES,2);
    console.log("Player 2 Shapes", player2Shapes);
    setPlayerAvailableShapes({player: "player2", shapes: player2Shapes});
    setPlayerAvailableShapes({player: "player1", shapes: player1Shapes});
    setOverlayComponent(<MarketPlace shapes={SHAPES} />);
  }, []);

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
      { showOverlay ? <Overlay /> : null }
      <h1>Hello</h1>
      <div id="interactive-panel">
        
        {
          players.player1.availableShapes  && grid ? <ShapeSelector shapes={players.player1.availableShapes} /> : null
        }        
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
          {
            currentPlayerTurn
            ? <GhostShape shape={selectedShape} x={mousePos.x} y={mousePos.y} cellSize={40} />
            : null
          }
          
        </div>
      )}
    </ShapeDataContext.Provider>
  );
}

export default App;

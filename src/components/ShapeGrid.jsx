import { useEffect, useRef, useContext, useState } from "react";
import { Context as ShapeDataContext } from "../context/ShapeDataContext";
import { Context as GameDataContext } from "../context/GameDataContext";
import { chooseShapesToBuy, placeRandomShape } from "../logic/placement";
import { SHAPES } from "../shapes/shapeDefinitions";

const ShapeGrid = () => {
  const { state: { selectedShape }, setSelectedShape } = useContext(ShapeDataContext);
  const { state: { player, currentPlayerTurn, players, grid }, 
    setCurrentPlayerTurn, 
    addPlayerTurnAndUpdateScore, 
    setGrid,
    setPlayerAvailableShapes,
    setPlayerScore
  } = useContext(GameDataContext);
  const canvasRef = useRef(null);

  const size = 10;
  const cellSize = 40;

  //const [grid, setGrid] = useState([]);
  const [hoverPos, setHoverPos] = useState({ gx: -1, gy: -1 });

  const player1Color = "rgba(50, 50, 200, 0.5)";

  // Initialize grid
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

  // Draw grid with hover highlight
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

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        ctx.strokeStyle = "black";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // highlight hover cells if any
        if (selectedShape && hoverPos.gx >= 0 && hoverPos.gy >= 0) {
          const cells = selectedShape.cells || [[0, 0]];
          const isHoverCell = cells.some(([cx, cy]) => {
            const hx = hoverPos.gx + cx;
            const hy = hoverPos.gy + cy;
            return hx === x && hy === y;
          });
          if (isHoverCell) {
            const occupied = cells.some(([cx, cy]) => {
              const hx = hoverPos.gx + cx;
              const hy = hoverPos.gy + cy;
              return hy >= 0 && hy < size && hx >= 0 && hx < size && grid[hy][hx].occupied;
            });
            ctx.fillStyle = occupied ? "rgba(255,0,0,0.4)" : "rgba(0,255,0,0.4)";
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }

        // fill if already occupied
        if (cell.occupied) {
          //ctx.fillStyle = "rgba(50, 50, 200, 0.5)";
          ctx.fillStyle = cell.color;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }

        ctx.fillStyle = "black";
        ctx.fillText(cell.value, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
      });
    });
  }, [grid, hoverPos, selectedShape]);

  // Update hover position
  const handleMouseMove = (e) => {
    if (!selectedShape) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let gx = Math.floor(mouseX / cellSize);
    let gy = Math.floor(mouseY / cellSize);

    const cells = selectedShape.cells || [[0, 0]];
    const shapeWidth = Math.max(...cells.map(c => c[0])) + 1;
    const shapeHeight = Math.max(...cells.map(c => c[1])) + 1;

    gx = Math.max(0, Math.min(size - shapeWidth, gx));
    gy = Math.max(0, Math.min(size - shapeHeight, gy));

    setHoverPos({ gx, gy });
  };

  // Place shape on click
  const handleClick = (e) => {
    if (!selectedShape || hoverPos.gx < 0 || hoverPos.gy < 0) return;

    const gx = hoverPos.gx;
    const gy = hoverPos.gy;

    const cells = selectedShape.cells || [[0, 0]];

    // Check for overlap
    for (let [cx, cy] of cells) {
      const x = gx + cx;
      const y = gy + cy;
      if (grid[y][x].occupied) return; // blocked
    }

    // Place shape and calculate score
    let score = 0;
    let selectedCells = []
    const newGrid = grid.map((row, y) =>
      row.map((cell, x) => {
        if (cells.some(([cx, cy]) => cx + gx === x && cy + gy === y)) {
          score += cell.value;
          selectedCells.push({
            x : x,
            y : y,
            val : cell.value
          });
          return { ...cell, occupied: true, color: player1Color  };
        }
        return cell;
      })
    );

    setGrid(newGrid);
    // console.log(`Placed shape ${selectedShape.id} at (${gx},${gy}) — Score: ${score}`);
    // console.log("Selected Cells", selectedCells);
    const turn = {
      shapeId : selectedShape.id,
      selectedCells,
      score
    };
    addPlayerTurnAndUpdateScore({player, turn});
    //Update the player object and turn
    setCurrentPlayerTurn(false);
    
    //Get the player 2 move
    const player2Turn  = placeRandomShape(newGrid, players["player2"].availableShapes);
    

    //Store the player 2 turn
    if(player2Turn) {
      addPlayerTurnAndUpdateScore({player:"player2", turn : {
        shapeId : player2Turn.shapeId,
        selectedCells : player2Turn.selectedCells,
        score : player2Turn.score,
      }});

      //NEED AI TO DECIDE PLAYER 2 BUYING SHAPES
      const player2AvailableShapes = players["player2"].availableShapes.filter((shape) => shape.id !== player2Turn.shapeId);
      const marketAvailableShapes = SHAPES.filter((shape) => !player2AvailableShapes.includes(shape));

      console.log("GRID AND PLAYER INFO", newGrid,player2AvailableShapes, marketAvailableShapes,players["player2"].score , player2Turn.score );
      const purchasedShapes = chooseShapesToBuy(player2Turn.grid,player2AvailableShapes,marketAvailableShapes,players["player2"].score + player2Turn.score );
      console.log("PLAYER 2 PURCHASED SHAPES", purchasedShapes);
      const newAvailableShapes = [...player2AvailableShapes,...purchasedShapes.purchases];
      setPlayerAvailableShapes( {"player" : "player2", "shapes" : newAvailableShapes});
      //Update the player score
      setPlayerScore({"player" : "player2", "score" : (players["player2"].score + player2Turn.score) - purchasedShapes.totalCost});
      setSelectedShape(null);
      setGrid(player2Turn.grid);


    } else {
      //Player 2 cannot go - needs to handle last turn
      console.log("PLAYER 2 NO MORE TURNS");
    }


    setCurrentPlayerTurn(true);
    console.log("THE PLAYERS ARE", players);


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
        onMouseMove={ currentPlayerTurn ? handleMouseMove : null } 
        onClick={ currentPlayerTurn ? handleClick : null }
      />
    </div>
  );
};

export default ShapeGrid;

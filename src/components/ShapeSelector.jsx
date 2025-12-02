import { useState, useContext } from "react";
import {Context as ShapeDataContext} from "../context/ShapeDataContext";
import {Context as GameDataContext} from "../context/GameDataContext";
import { SHAPES } from "../shapes/shapeDefinitions";
import { canAnyShapeFit } from "../logic/placement";
import ShapeDisplay from "./ShapeDisplay";
import MarketPlace from "./MarketPlace";

const CELL = 20; // square size in px

const ShapeSelector = (props) => {
  const [selected, setSelected] = useState(null);
  const {setSelectedShape} = useContext(ShapeDataContext);
  const {state:{currentPlayerTurn, grid, player,players}, setCurrentPlayerTurn, setShowOverlay,setOverlayComponent} = useContext(GameDataContext);

  const handleSelect = (shape) => {
    //Block selection if not the player's turn
    console.log('CURRENT PLAYER TURN', currentPlayerTurn);
    if(!currentPlayerTurn) return;

    if(!canAnyShapeFit(grid,props.shapes)) {
      console.log("PLAYER CANNOT GO");
    }
    console.log("Shape clicked:", shape);
    setSelected(shape.id);
    setSelectedShape(shape);
  };

  const handleBuyShapes = () => {
    setSelectedShape(null);
    setShowOverlay(true);
    console.log("CURRENT PLAYER", player );
    //Filters the player's available shapes to remove ones they own
    const currentPlayerAvailableShapes = players[player].availableShapes;
    const marketAvailableShapes = SHAPES.filter((shape) => !currentPlayerAvailableShapes.includes(shape));
    setOverlayComponent(<MarketPlace shapes={marketAvailableShapes} player={player} />);
  }

  return (
    <div className="shapeSelector grid grid-cols-4 gap-4 p-4">
      <h3>{props.playerText}</h3>
      <p>Score = {props.player.score}</p>
      {props.shapes.map((shape) => {
        //return <ShapeDisplay key={shape.id} shape={shape} />
        const { width, height } = shape.getBoundingBox();

        return (
          <div
            key={shape.id}
            onClick={ currentPlayerTurn && props.allowInteraction ? () => handleSelect(shape) : null }
            className={`border rounded p-2 cursor-pointer hover:bg-gray-100 transition ${
              selected === shape.id ? "bg-blue-100" : ""
            }`}
            style={{ width: width * CELL + 10 }}
          >
            <ShapeDisplay shape={shape} cellSize={CELL} />
            {/* <div
              style={{
                position: "relative",
                width: width * CELL,
                height: height * CELL,
              }}
            >
              {shape.cells.map(([x, y], index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: x * CELL,
                    top: y * CELL,
                    width: CELL,
                    height: CELL,
                    background: "#333",
                    border: "1px solid #999",
                  }}
                />
              ))}
            </div> */}
            {/* <p className="text-sm mt-1 text-center">{shape.id}</p> */}
          </div>
        );
      })}
      {
        props.allowInteraction
        ?<button 
          className="btn-alt" 
          onClick={() => handleBuyShapes()}
          disabled={players[player].score < 1 } 
        >Buy</button> : null
      }

    </div>
  );
};

export default ShapeSelector;
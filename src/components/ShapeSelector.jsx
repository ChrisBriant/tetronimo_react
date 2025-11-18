import { useState, useContext } from "react";
import {Context as ShapeDataContext} from "../context/ShapeDataContext";
import {Context as GameDataContext} from "../context/GameDataContext";
import { SHAPES } from "../shapes/shapeDefinitions";

const CELL = 20; // square size in px

const ShapeSelector = () => {
  const [selected, setSelected] = useState(null);
  const {setSelectedShape} = useContext(ShapeDataContext);
  const {state:{currentPlayerTurn}, setCurrentPlayerTurn} = useContext(GameDataContext);

  const handleSelect = (shape) => {
    //Block selection if not the player's turn
    console.log('CURRENT PLAYER TURN', currentPlayerTurn);
    if(!currentPlayerTurn) return;
    console.log("Shape clicked:", shape);
    setSelected(shape.id);
    setSelectedShape(shape);
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {SHAPES.map((shape) => {
        const { width, height } = shape.getBoundingBox();

        return (
          <div
            key={shape.id}
            onClick={ currentPlayerTurn ? () => handleSelect(shape) : null }
            className={`border rounded p-2 cursor-pointer hover:bg-gray-100 transition ${
              selected === shape.id ? "bg-blue-100" : ""
            }`}
            style={{ width: width * CELL + 10 }}
          >
            <div
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
            </div>
            <p className="text-sm mt-1 text-center">{shape.id}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ShapeSelector;
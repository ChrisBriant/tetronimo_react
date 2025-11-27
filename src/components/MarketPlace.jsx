import { useState } from "react";
import ShapeDisplay from "./ShapeDisplay";

const CELL = 20; // square size in px

const MarketPlace = (props) => {
    const [selected, setSelected] = useState(null);


    const handleBuyShape = (shape) => {
        const shapeCost = shape.cells.length;

        console.log("BUY SHAPE", shape.id, shapeCost);
    }

    return(
        <div id="marketPlace">
            {
                props.shapes.map((shape) => (
                    <div
                        key={shape.id}
                        onClick={ () => handleBuyShape(shape) }
                        className={`border rounded p-2 cursor-pointer hover:bg-gray-100 transition ${
                        selected === shape.id ? "bg-blue-100" : ""
                        }`}
                        style={{ width: shape.getBoundingBox().width * CELL + 10 }}
                    >
                        <ShapeDisplay shape={shape} cellSize={CELL} />
                    </div>
                ))
            }        
        </div>
    );
}

export default MarketPlace;
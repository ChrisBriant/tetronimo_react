import { useState, useContext, useEffect } from "react";
import { Context as GameDataContext } from "../context/GameDataContext";
import ShapeDisplay from "./ShapeDisplay";
import ErrorDisplay from "./messaging-components/ErrorDisplay";

const CELL = 20; // square size in px

const MarketPlace = (props) => {
    const [selectedShapes, setSelectedShapes] = useState([]);
    const [credit, setCredit] = useState(0);
    const [errorMessage,setErrorMessage] = useState("");
    const {state:{players},setShowOverlay,setOverlayComponent,setPlayerAvailableShapes,setPlayerScore} = useContext(GameDataContext);

    useEffect(() => {
        setCredit(players[props.player].score);
    },[]);

    console.log("MOUNTED", selectedShapes);

    const handleSelectShape = (shape) => {
        setErrorMessage("");
        const shapeCost = shape.cells.length;

        //If the shape is selected then it needs to deselect it and return
        if(selectedShapes.includes(shape.id)) {
            //Remove it
            const newSelectedShapes = [...selectedShapes.filter((id) => id !== shape.id)];
            setSelectedShapes(newSelectedShapes);
            //Refund
            const newCredit = credit + shapeCost;
            setCredit(newCredit);
            return;
        }

        if(credit >= shapeCost) {
            const newCredit = credit - shapeCost;
            setCredit(newCredit);
            const newSelectedShapes = [...selectedShapes];
            newSelectedShapes.push(shape.id);
            setSelectedShapes(newSelectedShapes);
        } else {
            setErrorMessage("You don't have enough credit to buy this shape.");

        }

    }

    const handleCancel = () => {
        //Drop out
        setShowOverlay(false);
        setOverlayComponent(null);
    }

    const handleBuyShapes = () => {
        //Update the shapes
        const selectedShapeObjects = props.shapes.filter((shape) => selectedShapes.includes(shape.id));
        const newAvailableShapes = [...players[props.player].availableShapes,...selectedShapeObjects ];
        setPlayerAvailableShapes( {"player" : props.player, "shapes" : newAvailableShapes});
        //Update the score
        setPlayerScore({"player" : props.player, "score" : credit});
        //Drop out
        setShowOverlay(false);
        setOverlayComponent(null);
    }

    return(
        <div id="marketPlace">
            <h2>Buy Shapes</h2>
            <h3>Credit = {credit}</h3>
            <div className="shapePanel">
            {
                props.shapes.map((shape) => (
                    <div
                        key={shape.id}
                        onClick={ () => handleSelectShape(shape) }
                        className={`border rounded p-2 cursor-pointer hover:bg-gray-100 transition ${
                        selectedShapes.includes(shape.id) ? "bg-blue-100" : ""
                        }`}
                        style={{ width: shape.getBoundingBox().width * CELL + 10 }}
                    >
                        {/* {
                        selectedShapes.includes(shape.id) ? "bg-blue-100" : ""
                            ?<p>selected</p>
                            :<p>NOT SELECTED</p>
                        } */}
                        <ShapeDisplay shape={shape} cellSize={CELL} />
                    </div>
                ))
            }   
            </div> 
            {
                errorMessage !== ""
                ? <ErrorDisplay message={errorMessage} />
                : null
            }
            <div className="btnGroup">
                <button onClick={() => handleBuyShapes()}>
                    Buy
                </button>
                <button onClick={() => handleCancel()}>
                    Cancel
                </button>
            </div>    
        </div>
    );
}

export default MarketPlace;
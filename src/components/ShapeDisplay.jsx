// import { useContext } from "react";
// import {Context as GameDataContext} from "../context/GameDataContext";


const ShapeDisplay = (props) => {
    // const [selected, setSelected] = useState(null);
    // const {state:{currentPlayerTurn},} = useContext(GameDataContext);
    // const {setSelectedShape} = useContext(ShapeDataContext);
    // const { width, height } = props.shape.getBoundingBox();

    // const handleSelect = (shape) => {
    // //Block selection if not the player's turn
    // console.log('CURRENT PLAYER TURN', currentPlayerTurn);
    // if(!currentPlayerTurn) return;

    // if(!canAnyShapeFit(grid,props.shapes)) {
    //     console.log("PLAYER CANNOT GO");
    // }
    //     console.log("Shape clicked:", shape);
    //     setSelected(shape.id);
    //     setSelectedShape(shape);
    // };
    const { width, height } = props.shape.getBoundingBox();


    return (
        <div
            style={{
            position: "relative",
            width: width * props.cellSize,
            height: height * props.cellSize,
            }}
        >
            {props.shape.cells.map(([x, y], index) => (
            <div
                key={index}
                style={{
                position: "absolute",
                left: x * props.cellSize,
                top: y * props.cellSize,
                width: props.cellSize,
                height: props.cellSize,
                background: "#333",
                border: "1px solid #999",
                }}
            />
            ))}
        </div>
    );
}

export default ShapeDisplay;
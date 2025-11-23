import { useContext } from "react";
import { Context as GameDataContext} from '../context/GameDataContext';

const Overlay = () => {
    const { state: {overlayComponent}} = useContext(GameDataContext);

    return (
        <div className="overlay">
            { overlayComponent 
                ? <div className="overlayPanel">
                    { overlayComponent }
                </div> 
                : null}
        </div>
    )
}

export default Overlay;
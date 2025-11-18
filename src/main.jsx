import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider as ShapeDataProvider } from "./context/ShapeDataContext.jsx";
import { Provider as GameDataProvider } from "./context/GameDataContext.jsx";

createRoot(document.getElementById('root')).render(
  <GameDataProvider>
    <ShapeDataProvider>
      <App />
    </ShapeDataProvider>
  </GameDataProvider>
)

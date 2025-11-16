import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider as ShapeDataProvider } from "./context/ShapeDataContext.jsx";

createRoot(document.getElementById('root')).render(
  <ShapeDataProvider>
    <App />
  </ShapeDataProvider>
)

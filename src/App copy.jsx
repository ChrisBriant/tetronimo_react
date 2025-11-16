import { useState } from 'react';
import './App.css';
import './components/ShapeGrid';
import ShapeGrid from './components/ShapeGrid';
import ShapeSelector from './components/ShapeSelector';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Hello</h1>
      <div id='interactive-panel'>
        <ShapeSelector />
        <ShapeGrid />
      </div>

    </>
  )
}

export default App

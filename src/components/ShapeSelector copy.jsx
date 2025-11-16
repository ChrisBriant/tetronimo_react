import { useState } from "react";

// Define all polyomino shapes from size 1 to 5 (monomino → pentomino)
// Shapes are stored as arrays of [x, y] coordinates
// All shapes are normalized so their top-left block is at (0,0)

const SHAPES = [
  // --- Monomino (size 1) ---
  { id: "mono", cells: [[0, 0]] },

  // --- Dominoes (size 2) ---
  { id: "domino_h", cells: [[0, 0], [1, 0]] },
  { id: "domino_v", cells: [[0, 0], [0, 1]] },

  // --- Trominoes (size 3) ---
  { id: "tri_line_h", cells: [[0, 0], [1, 0], [2, 0]] },
  { id: "tri_line_v", cells: [[0, 0], [0, 1], [0, 2]] },
  { id: "tri_L", cells: [[0, 0], [1, 0], [0, 1]] },

  // --- Tetrominoes (size 4) ---
  // I
  { id: "tet_I_h", cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  { id: "tet_I_v", cells: [[0, 0], [0, 1], [0, 2], [0, 3]] },
  // O
  { id: "tet_O", cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  // L
  { id: "tet_L", cells: [[0, 0], [0, 1], [0, 2], [1, 2]] },
  { id: "tet_J", cells: [[1, 0], [1, 1], [1, 2], [0, 2]] },
  // T
  { id: "tet_T", cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  // S
  { id: "tet_S", cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  // Z
  { id: "tet_Z", cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },

  // --- Pentominoes (size 5) ---
  // A small representative subset (full pentomino set can be added if desired)
  { id: "pento_F", cells: [[1,0],[0,1],[1,1],[1,2],[2,2]] },
  { id: "pento_L", cells: [[0,0],[0,1],[0,2],[0,3],[1,3]] },
  { id: "pento_T", cells: [[1,0],[0,1],[1,1],[2,1],[1,2]] },
  { id: "pento_U", cells: [[0,0],[2,0],[0,1],[1,1],[2,1]] },
  { id: "pento_X", cells: [[1,0],[0,1],[1,1],[2,1],[1,2]] },
];

const CELL = 20; // square size in px

const ShapeSelector = () => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (shape) => {
    console.log("Shape clicked:", shape);
    setSelected(shape.id);
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {SHAPES.map((shape) => {
        const maxX = Math.max(...shape.cells.map((c) => c[0]));
        const maxY = Math.max(...shape.cells.map((c) => c[1]));

        return (
          <div
            key={shape.id}
            onClick={() => handleSelect(shape)}
            className={`border rounded p-2 cursor-pointer hover:bg-gray-100 transition ${
              selected === shape.id ? "bg-blue-100" : ""
            }`}
            style={{ width: (maxX + 1) * CELL + 10 }}
          >
            <div
              style={{
                position: "relative",
                width: (maxX + 1) * CELL,
                height: (maxY + 1) * CELL,
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

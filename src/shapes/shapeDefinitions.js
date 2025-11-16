import Shape from "./Shape";

/*
 All shapes are defined using relative [x, y] coordinates.
 Each shape is normalized inside the Shape constructor so the top-left
 is always (0, 0).
*/

export const SHAPES = [
    // --- 1. Monomino ---
    new Shape("mono", [[0, 0]]),

    // --- 2. Dominoes ---
    new Shape("domino_h", [[0, 0], [1, 0]]),
    new Shape("domino_v", [[0, 0], [0, 1]]),

    // --- 3. Trominoes ---
    // straight
    new Shape("tri_line_h", [[0, 0], [1, 0], [2, 0]]),
    new Shape("tri_line_v", [[0, 0], [0, 1], [0, 2]]),

    // L-tromino
    new Shape("tri_L", [[0, 0], [1, 0], [0, 1]]),

    // --- 4. Tetrominoes (official Tetris set) ---
    // I
    new Shape("tet_I", [[0, 0], [1, 0], [2, 0], [3, 0]]),

    // O
    new Shape("tet_O", [[0, 0], [1, 0], [0, 1], [1, 1]]),

    // T
    new Shape("tet_T", [[1, 0], [0, 1], [1, 1], [2, 1]]),

    // S
    new Shape("tet_S", [[1, 0], [2, 0], [0, 1], [1, 1]]),

    // Z
    new Shape("tet_Z", [[0, 0], [1, 0], [1, 1], [2, 1]]),

    // L
    new Shape("tet_L", [[0, 0], [0, 1], [0, 2], [1, 2]]),

    // J
    new Shape("tet_J", [[1, 0], [1, 1], [1, 2], [0, 2]]),

    // --- 5. Pentominoes (all 12 canonical) ---

    // F
    new Shape("pento_F", [[1,0],[0,1],[1,1],[1,2],[2,2]]),

    // I
    new Shape("pento_I", [[0,0],[0,1],[0,2],[0,3],[0,4]]),

    // L
    new Shape("pento_L", [[0,0],[0,1],[0,2],[0,3],[1,3]]),

    // N
    new Shape("pento_N", [[0,0],[1,0],[1,1],[1,2],[2,2]]),

    // P
    new Shape("pento_P", [[0,0],[1,0],[0,1],[1,1],[0,2]]),

    // T
    new Shape("pento_T", [[1,0],[0,1],[1,1],[2,1],[1,2]]),

    // U
    new Shape("pento_U", [[0,0],[2,0],[0,1],[1,1],[2,1]]),

    // V
    new Shape("pento_V", [[0,0],[0,1],[0,2],[1,2],[2,2]]),

    // W
    new Shape("pento_W", [[0,0],[0,1],[1,1],[1,2],[2,2]]),

    // X
    new Shape("pento_X", [[1,0],[0,1],[1,1],[2,1],[1,2]]),

    // Y
    new Shape("pento_Y", [[0,0],[0,1],[0,2],[0,3],[1,0]]),

    // Z
    new Shape("pento_Z", [[0,0],[1,0],[1,1],[1,2],[2,2]]),
];

export default SHAPES;

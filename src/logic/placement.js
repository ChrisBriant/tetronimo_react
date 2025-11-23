const player2Color = "rgba(145, 50, 200, 0.5)";

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function normalizeShapeCells(cells) {
    const norm = cells.map(([x, y]) => ({ x, y }));
    return norm;
}

function canPlaceShape(grid, shapeCells, gx, gy) {
    const rows = grid.length;
    const cols = grid[0].length;

    for (const cell of shapeCells) {
        const x = gx + cell.x;
        const y = gy + cell.y;

        if (x < 0 || y < 0 || x >= cols || y >= rows)
            return false;

        if (grid[y][x].occupied === true)
            return false;
    }

    return true;
}

function findRandomPlacement(grid, shapes) {
    const rows = grid.length;
    const cols = grid[0].length;

    const randomShapes = shuffle(shapes);

    for (const shape of randomShapes) {
        const shapeCells = normalizeShapeCells(shape.cells);

        for (let gy = 0; gy < rows; gy++) {
            for (let gx = 0; gx < cols; gx++) {

                if (canPlaceShape(grid, shapeCells, gx, gy)) {

                    // Build absolute coordinates for scoring and return
                    const absoluteCells = shapeCells.map(c => ({
                        x: gx + c.x,
                        y: gy + c.y
                    }));

                    return {
                        id: shape.id,
                        cells: shapeCells,       // relative cells
                        absCells: absoluteCells, // absolute cells
                        x: gx,
                        y: gy
                    };
                }
            }
        }
    }

    return null;
}

function applyPlacement(grid, placement) {
    if (!placement) return null;

    const { absCells } = placement;

    const newGrid = grid.map(row =>
        row.map(cell => ({ ...cell }))
    );

    let score = 0;
    let selectedCells = []
    for (const cell of absCells) {
        const gCell = newGrid[cell.y][cell.x];
        gCell.occupied = true;
        gCell.color = player2Color;

        // Add score from grid values
        if (typeof gCell.value === "number") {
            score += gCell.value;
            selectedCells.push({
                x : cell.x,
                y : cell.y,
                val : gCell.value
            });
        }
    }

    return {
        grid: newGrid,
        absCells,
        selectedCells,
        score
    };
}


export function canAnyShapeFit(grid, shapes) {
    const rows = grid.length;
    const cols = grid[0].length;

    for (const shape of shapes) {
        const shapeCells = normalizeShapeCells(shape.cells);

        // Try placing this shape at every grid coordinate
        for (let gy = 0; gy < rows; gy++) {
            for (let gx = 0; gx < cols; gx++) {

                if (canPlaceShape(grid, shapeCells, gx, gy)) {
                    return true; // Found at least one valid placement
                }

            }
        }
    }

    return false; // No valid placement for any shape
}


export function placeRandomShape(grid, shapes) {
    const placement = findRandomPlacement(grid, shapes);
    if (!placement) return null;

    const result = applyPlacement(grid, placement);

    return {
        shapeId: placement.id,
        placementX: placement.x,
        placementY: placement.y,
        absCells: result.absCells,
        selectedCells : result.selectedCells,
        score: result.score,
        grid: result.grid
    };
}

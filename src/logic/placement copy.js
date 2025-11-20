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
                    return {
                        id: shape.id,
                        cells: shapeCells,
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

    const { cells, x, y } = placement;

    const newGrid = grid.map(row =>
        row.map(cell => ({ ...cell }))
    );

    for (const c of cells) {
        newGrid[y + c.y][x + c.x].occupied = true;
    }

    return newGrid;
}

export function placeRandomShape(grid, shapes) {
    const placement = findRandomPlacement(grid, shapes);
    if (!placement) return null;
    return applyPlacement(grid, placement);
}

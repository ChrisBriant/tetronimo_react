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


//AI Market Place Purchase Decisions

// Helper: get shape cost = blocks - 1
function shapeCost(shape) {
    return shape.cells.length;
}

// Helper: generate all 4 rotations
function getRotations(shape) {
    const rots = [];
    let current = shape.cells;

    for (let i = 0; i < 4; i++) {
        const minX = Math.min(...current.map(c => c[0]));
        const minY = Math.min(...current.map(c => c[1]));
        const normalized = current.map(([x, y]) => [x - minX, y - minY]);
        rots.push(normalized);

        current = current.map(([x, y]) => [y, -x]); // rotate 90°
    }

    // Remove duplicates
    const key = r => JSON.stringify(r.sort());
    const unique = Array.from(new Map(rots.map(r => [key(r), r])).values());

    return unique;
}

// Check if shape (in a specific rotation) fits at grid position
function canPlaceAt(grid, rotation, gx, gy) {
    for (const [dx, dy] of rotation) {
        const x = gx + dx;
        const y = gy + dy;

        if (y < 0 || y >= grid.length) return false;
        if (x < 0 || x >= grid[0].length) return false;
        if (grid[y][x].occupied) return false;
    }
    return true;
}

// Check whether shape fits anywhere on the board
function shapeFitsAnywhere(grid, shape) {
    const rotations = getRotations(shape);

    for (const rot of rotations) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (canPlaceAt(grid, rot, x, y)) return true;
            }
        }
    }
    return false;
}

// ---------------------------------------------------------------------------
//  MAIN FUNCTION: now returns REAL SHAPE OBJECTS instead of IDs
// ---------------------------------------------------------------------------

export function chooseShapesToBuy(grid, cpuShapes, marketplaceShapes, score) {
    const purchasable = marketplaceShapes
        .map(shape => ({
            shape,
            cost: shapeCost(shape),
            fits: shapeFitsAnywhere(grid, shape),
            size: shape.cells.length
        }))
        .filter(s => s.fits && s.cost <= score);  // MUST: affordable + fits

    if (purchasable.length === 0) return { purchases : [], totalCost : 0 };

    // Score shapes by usefulness
    for (const p of purchasable) {
        const sizeFactor = p.size;
        const efficiency = p.size / p.cost;

        const cpuHasSimilar = cpuShapes.some(s => s.cells.length === p.size);
        const diversityBonus = cpuHasSimilar ? 0.5 : 1.2;

        p.score =
            sizeFactor *       // big shapes good
            efficiency *       // cheap-for-size shapes good
            diversityBonus;    // avoid duplicates
    }

    // Best score per cost, descending
    purchasable.sort((a, b) => (b.score / b.cost) - (a.score / a.cost));

    const purchases = [];
    let remaining = score;
    let totalCost = 0;

    for (const p of purchasable) {
        if (p.cost > remaining) continue;
        purchases.push(p.shape);  // RETURN FULL SHAPE OBJECT
        totalCost += p.cost;
        remaining -= p.cost;
    }

    return { purchases, totalCost };
}

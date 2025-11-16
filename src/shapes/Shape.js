export default class Shape {
    constructor(id, cells) {
        this.id = id;
        this.cells = this.normalize(cells); // always store in normalized form
    }

    // Move the shape so its top-left is at (0,0)
    normalize(cells) {
        const minX = Math.min(...cells.map(([x]) => x));
        const minY = Math.min(...cells.map(([, y]) => y));
        return cells.map(([x, y]) => [x - minX, y - minY]);
    }

    // Useful for rotating in a placement grid
    rotate90() {
        const rotated = this.cells.map(([x, y]) => [y, -x]);
        return new Shape(this.id + "_r", rotated);
    }

    flipHorizontal() {
        const maxX = Math.max(...this.cells.map(([x]) => x));
        const flipped = this.cells.map(([x, y]) => [maxX - x, y]);
        return new Shape(this.id + "_fh", flipped);
    }

    getBoundingBox() {
        const maxX = Math.max(...this.cells.map(([x]) => x));
        const maxY = Math.max(...this.cells.map(([, y]) => y));
        return { width: maxX + 1, height: maxY + 1 };
    }
}

function Grid(points, cellSize) {
    this._cells = [];
    this._cellSize = cellSize;
    this._reverseCellSize = 1 / cellSize;

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const x = this.point2Cell(point[0]);
        const y = this.point2Cell(point[1]);
        if (this._cells[x] === undefined) {
            const array = [];
            array[y] = [point];
            this._cells[x] = array;
        } else if (this._cells[x][y] === undefined) {
            this._cells[x][y] = [point];
        } else {
            this._cells[x][y].push(point);
        }
    }
}

Grid.prototype = {
    cellPoints: function(x, y) { // (Number, Number) -> Array
        return (this._cells[x] !== undefined && this._cells[x][y] !== undefined) ? this._cells[x][y] : [];
    },

    rangePoints: function(bbox) { // (Array) -> Array
        const tlCellX = this.point2Cell(bbox[0]);
        const tlCellY = this.point2Cell(bbox[1]);
        const brCellX = this.point2Cell(bbox[2]);
        const brCellY = this.point2Cell(bbox[3]);
        const points = [];

        for (var x = tlCellX; x <= brCellX; x++) {
            for (var y = tlCellY; y <= brCellY; y++) {
                Array.prototype.push.apply(points, this.cellPoints(x, y));
            }
        }

        return points;
    },

    removePoint: function(point) { // (Array) -> Array
        const cellX = this.point2Cell(point[0]);
        const cellY = this.point2Cell(point[1]);
        const cell = this._cells[cellX][cellY];
        let pointIdxInCell;
        
        for (var i = 0; i < cell.length; i++) {
            if (cell[i][0] === point[0] && cell[i][1] === point[1]) {
                pointIdxInCell = i;
                break;
            }
        }

        cell.splice(pointIdxInCell, 1);

        return cell;
    },

    point2Cell: function(x) { // (Array) -> Array
        return (x * this._reverseCellSize) | 0;
    },

    extendBbox: function(bbox, scaleFactor) { // (Array, Number) -> Array
        return [
            bbox[0] - (scaleFactor * this._cellSize),
            bbox[1] - (scaleFactor * this._cellSize),
            bbox[2] + (scaleFactor * this._cellSize),
            bbox[3] + (scaleFactor * this._cellSize)
        ];
    }
};

function grid(points, cellSize) {
    return new Grid(points, cellSize);
}

module.exports = grid;
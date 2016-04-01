var assert = require("assert"),
    grid = require('../src/grid.js');

var points = [
    // cell 0,0
    [0, 0],
    [1, 1],
    [9, 5],
    // cell 0,1
    [1, 11],
    [5, 15],
    // cell 1,0
    [11, 0],
    [11, 1],
    [19, 5],
    // cell 1,1
    [10, 10],
    [11, 11]
];
var g = grid(points, 10);

module.exports = function() {
    describe('cellPoints', function() {
        it('should return all points from cell [0,0]', function() {
            assert.deepEqual(g.cellPoints(0, 0), [[0, 0], [1, 1], [9, 5]]);
        });
        it('should return all points from cell [0,1]', function() {
            assert.deepEqual(g.cellPoints(0, 1), [[1, 11], [5, 15]]);
        });
        it('should return all points from cell [1,0]', function() {
            assert.deepEqual(g.cellPoints(1, 0), [[11, 0], [11, 1], [19, 5]]);
        });
        it('should return all points from cell [1,1]', function() {
            assert.deepEqual(g.cellPoints(1, 1), [[10, 10],[11, 11]]);
        });
    });

    describe('point2CellXY', function() {
        it('should return [0,0]', function() {
            assert.deepEqual(g.point2CellXY([1, 1]), [0, 0]);
        });
        it('should return [0,1]', function() {
            assert.deepEqual(g.point2CellXY([1, 11]), [0, 1]);
        });
        it('should return [1,0]', function() {
            assert.deepEqual(g.point2CellXY([11, 1]), [1, 0]);
        });
        it('should return [1,1]', function() {
            assert.deepEqual(g.point2CellXY([10, 10]), [1, 1]);
        });
        it('should return [1,1]', function() {
            assert.deepEqual(g.point2CellXY([11, 11]), [1, 1]);
        });
    });

    describe('rangePoints', function() {
        it('should return points from cells [0,0] and [0,1]', function() {
            assert.deepEqual(g.rangePoints([1, 0, 6, 16]), [[0, 0], [1, 1], [9, 5], [1, 11], [5, 15]]);
        });
        it('should return points from cells [0,0] and [1,1]', function() {
            assert.deepEqual(g.rangePoints([0, 0, 11, 11]), points);
        });
    });

    describe('extendBbox', function() {
        it('should increase bBox to 1 cell', function() {
            assert.deepEqual(g.extendBbox([0, 0, 11, 11], 1), [-10, -10, 21, 21]);
        });
        it('should increase bBox to 2 cells', function() {
            assert.deepEqual(g.extendBbox([0, 0, 11, 11], 2), [-20, -20, 31, 31]);
        });
    });
}


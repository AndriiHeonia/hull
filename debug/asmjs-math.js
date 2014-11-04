!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.hull=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Grid(points) {
    var _cells = [];

    points.forEach(function(point) {
        var cellXY = this.point2CellXY(point),
            x = cellXY[0],
            y = cellXY[1];
        if (_cells[x] === undefined) {
            _cells[x] = [];
        }
        if (_cells[x][y] === undefined) {
            _cells[x][y] = [];
        }
        _cells[x][y].push(point);
    }, this);

    this.cellPoints = function(x, y) { // (Number, Number) -> Array
        return (_cells[x] !== undefined && _cells[x][y] !== undefined) ? _cells[x][y] : [];
    };

    this.removePoint = function(point) { // (Array) -> Array
        var cellXY = this.point2CellXY(point),
            cell = _cells[cellXY[0]][cellXY[1]],
            pointIdxInCell;
        
        for (var i = 0; i < cell.length; i++) {
            if (cell[i][0] === point[0] && cell[i][1] === point[1]) {
                pointIdxInCell = i;
                break;
            }
        }

        cell.splice(pointIdxInCell, 1);

        return cell;
    };
}

Grid.prototype = {
    point2CellXY: function(point) { // (Array) -> Array
        var x = parseInt(point[0] / Grid.CELL_SIZE),
            y = parseInt(point[1] / Grid.CELL_SIZE);
        return [x, y];
    },

    rangePoints: function(bbox) { // (Array) -> Array
        var tlCellXY = this.point2CellXY([bbox[0], bbox[1]]),
            brCellXY = this.point2CellXY([bbox[2], bbox[3]]),
            points = [];

        for (var x = tlCellXY[0]; x <= brCellXY[0]; x++) {
            for (var y = tlCellXY[1]; y <= brCellXY[1]; y++) {
                points = points.concat(this.cellPoints(x, y));
            }
        }

        return points;
    },

    addBorder2Bbox: function(bbox, border) { // (Array, Number) -> Array
        return [
            bbox[0] - (border * Grid.CELL_SIZE),
            bbox[1] - (border * Grid.CELL_SIZE),
            bbox[2] + (border * Grid.CELL_SIZE),
            bbox[3] + (border * Grid.CELL_SIZE)
        ];
    }
};

function grid(points) {
    return new Grid(points);
}

Grid.CELL_SIZE = 10;

module.exports = grid;
},{}],2:[function(require,module,exports){
/*
 (c) 2014, Andrey Geonya
 Hull.js, a JavaScript library for concave hull generation by set of points.
 https://github.com/AndreyGeonya/hull
*/

'use strict';

var grid = require('./grid.js');
// var math = require('./math');
var math = require('./math-asm.js');

function _sortByX(pointset) {
    return pointset.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] - b[1];                           
        } else {                                                    
            return a[0] - b[0];                                                           
        }
    });
}

function _getMaxY(pointset) {
    var maxY = -Infinity;
    for (var i = pointset.length - 1; i >= 0; i--) {
        if (pointset[i][1] > maxY) {
            maxY = pointset[i][1];
        }
    }
    return maxY;
}

function _upperTangent(pointset) {
    var lower = [];
    for (var l = 0; l < pointset.length; l++) {
        var o = lower[lower.length - 2],
            a = lower[lower.length - 1],
            b = pointset[l];
        while (lower.length >= 2 && (math.cross(o[0], o[1], a[0], a[1], b[0], b[1]) <= 0)) {
            lower.pop();
            o = lower[lower.length - 2];
            a = lower[lower.length - 1];
            b = pointset[l];
        }
        lower.push(pointset[l]);
    }
    lower.pop();
    return lower;
}

function _lowerTangent(pointset) {
    var reversed = pointset.reverse(),
        upper = [];
    for (var u = 0; u < reversed.length; u++) {
        var o = upper[upper.length - 2],
            a = upper[upper.length - 1],
            b = reversed[u];
        while (upper.length >= 2 && (math.cross(o[0], o[1], a[0], a[1], b[0], b[1]) <= 0)) {
            upper.pop();
            o = upper[upper.length - 2];
            a = upper[upper.length - 1];
            b = reversed[u];
        }
        upper.push(reversed[u]);
    }
    upper.pop();
    return upper;
}

function _intersect(segment, pointset) {
    for (var i = 0; i < pointset.length - 1; i++) {
        var seg = [pointset[i], pointset[i + 1]];
        if (segment[0][0] === seg[0][0] && segment[0][1] === seg[0][1] ||
            segment[0][0] === seg[1][0] && segment[0][1] === seg[1][1]) {
            continue;
        }
        var x1 = segment[0][0], y1 = segment[0][1],
            x2 = segment[1][0], y2 = segment[1][1],
            x3 = seg[0][0], y3 = seg[0][1],
            x4 = seg[1][0], y4 = seg[1][1];
        if (math.intersect(x1, y1, x2, y2, x3, y3, x4, y4)) {
            return true;
        }
    }
    return false;
}

function _bBoxAround(edge, boxSize) {
    var minX, maxX, minY, maxY;

    if (edge[0][0] < edge[1][0]) {
        minX = edge[0][0] - boxSize;
        maxX = edge[1][0] + boxSize;
    } else {
        minX = edge[1][0] - boxSize;
        maxX = edge[0][0] + boxSize;
    }

    if (edge[0][1] < edge[1][1]) {
        minY = edge[0][1] - boxSize;
        maxY = edge[1][1] + boxSize;
    } else {
        minY = edge[1][1] - boxSize;
        maxY = edge[0][1] + boxSize;
    }

    return [
        minX, minY, // tl
        maxX, maxY  // br
    ];
}

function _midPoint(edge, innerPoints, convex) {
    var point = null,
        angle1Cos = MAX_CONCAVE_ANGLE_COS,
        angle2Cos = MAX_CONCAVE_ANGLE_COS,
        a1Cos, a2Cos;

    for (var i = 0; i < innerPoints.length; i++) {
        a1Cos = math.cos(edge[0][0], edge[0][1], edge[1][0], edge[1][1], innerPoints[i][0], innerPoints[i][1]);
        a2Cos = math.cos(edge[1][0], edge[1][1], edge[0][0], edge[0][1], innerPoints[i][0], innerPoints[i][1]);

        if (a1Cos > angle1Cos && a2Cos > angle2Cos &&
            !_intersect([edge[0], innerPoints[i]], convex) &&
            !_intersect([edge[1], innerPoints[i]], convex)) {

            angle1Cos = a1Cos;
            angle2Cos = a2Cos;
            point = innerPoints[i];
        }
    }

    return point;
}

function _concave(convex, maxSqEdgeLen, maxSearchBBoxSize, grid) {
    var edge,
        border,
        bBoxSize,
        midPoint,
        bBoxAround,    
        midPointInserted = false;

    for (var i = 0; i < convex.length - 1; i++) {
        edge = [convex[i], convex[i + 1]];

        if (math.sqLength(edge[0][0], edge[0][1], edge[1][0], edge[1][1]) < maxSqEdgeLen) { continue; }

        border = 0;
        bBoxSize = MIN_SEARCH_BBOX_SIZE;
        bBoxAround = _bBoxAround(edge, bBoxSize);
        do {
            bBoxAround = grid.addBorder2Bbox(bBoxAround, border);
            bBoxSize = bBoxAround[2] - bBoxAround[0];
            midPoint = _midPoint(edge, grid.rangePoints(bBoxAround), convex);            
            border++;
        }  while (midPoint === null && maxSearchBBoxSize > bBoxSize);

        if (midPoint !== null) {
            convex.splice(i + 1, 0, midPoint);
            grid.removePoint(midPoint);
            midPointInserted = true;
        }
    }

    if (midPointInserted) {
        return _concave(convex, maxSqEdgeLen, maxSearchBBoxSize, grid);
    }

    return convex;
}

function hull(pointset, concavity) {
    var lower, upper, convex,
        innerPoints,
        maxSearchBBoxSize,
        maxEdgeLen = concavity || 20;

    if (pointset.length < 4) {
        return pointset;
    }
    pointset = _sortByX(pointset);
    upper = _upperTangent(pointset);
    lower = _lowerTangent(pointset);
    convex = lower.concat(upper);
    convex.push(pointset[0]);

    maxSearchBBoxSize = Math.max(pointset[pointset.length - 1][0], _getMaxY(convex)) * MAX_SEARCH_BBOX_SIZE_PERCENT;
    innerPoints = pointset.filter(function(pt) {
        return convex.indexOf(pt) < 0;
    });
 
    return _concave(convex, Math.pow(maxEdgeLen, 2), maxSearchBBoxSize, grid(innerPoints));
}

var MAX_CONCAVE_ANGLE_COS = Math.cos(90 / (180 / Math.PI)); // angle = 90 deg
var MIN_SEARCH_BBOX_SIZE = 5;
var MAX_SEARCH_BBOX_SIZE_PERCENT = 0.8;

module.exports = hull;
},{"./grid.js":1,"./math-asm.js":3}],3:[function(require,module,exports){
(function (global){
function math(stdlib) {
    "use asm";

    var sqrt = stdlib.Math.sqrt;

    function _ccw(x1, y1, x2, y2, x3, y3) {
        x1 = +x1; y1 = +y1;
        x2 = +x2; y2 = +y2;
        x3 = +x3; y3 = +y3;
        var cw = 0.0;
        var result = 0;
        
        cw = +(+(y3 - y1) * +(x2 - x1)) - +(+(y2 - y1) * +(x3 - x1));
        
        return (cw > 0.0 ? 1 : cw < 0.0 ? 0 : 1) | 0;
    }

    function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        x1 = +x1; y1 = +y1;
        x2 = +x2; y2 = +y2;
        x3 = +x3; y3 = +y3;
        x4 = +x4; y4 = +y4;
        var ccw1 = 0;
        var ccw2 = 0;
        var ccw3 = 0;
        var ccw4 = 0;
        var result = 0;
        
        ccw1 = _ccw(x1, y1, x3, y3, x4, y4) | 0;
        ccw2 = _ccw(x2, y2, x3, y3, x4, y4) | 0;
        ccw3 = _ccw(x1, y1, x2, y2, x3, y3) | 0;
        ccw4 = _ccw(x1, y1, x2, y2, x4, y4) | 0;

        if (
            ((ccw1 | 0) != (ccw2 | 0) | 0) &
            ((ccw3 | 0) != (ccw4 | 0) | 0)
        ) {
            result = 1;
        } else {
            result = 0;
        }

        return result | 0;
    }

    function sqLength(ax, ay, bx, by) {
        ax = +ax; ay = +ay;
        bx = +bx; by = +by;
        var result = 0.0;
        result = +(+(bx - ax) * +(bx - ax)) + +(+(by - ay) * +(by - ay));
        return +result;
    }

    function cos(ox, oy, ax, ay, bx, by) {
        ox = +ox; oy = +oy;
        ax = +ax; ay = +ay;
        bx = +bx; by = +by;
        var sqALen = 0.0;
        var sqBLen = 0.0;
        var dot = 0.0;
        var result = 0.0;
        
        sqALen = +sqLength(ox, oy, ax, ay);
        sqBLen = +sqLength(ox, oy, bx, by);
        dot = +(+(ax - ox) * +(bx - ox)) + +(+(ay - oy) * +(by - oy));
        result = +(dot / +sqrt(sqALen * sqBLen));
        return +result;
    }

    function cross(ox, oy, ax, ay, bx, by) {
        ox = +ox; oy = +oy;
        ax = +ax; ay = +ay;
        bx = +bx; by = +by;
        return +(+(+(ax - ox) * +(by - oy)) - +(+(ay - oy) * +(bx - ox)));
    }

    return {
        intersect: intersect,
        sqLength: sqLength,
        cos: cos,
        cross: cross
    }
}

module.exports = math(typeof window !== 'undefined' ? window : global);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[2])(2)
});
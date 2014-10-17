/*
 (c) 2014, Andrey Geonya
 Hull.js, a JavaScript library for concave hull generation by set of points.
 https://github.com/AndreyGeonya/hull

 Related papers:
 http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf
 http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
 http://martin-thoma.com/how-to-check-if-two-line-segments-intersect/
 http://allenchou.net/2013/07/cross-product-of-2d-vectors/
 http://users.livejournal.com/_winnie/237714.html
 http://habrahabr.ru/post/105882/
*/

/*
 TOTO:
- Adjust EDGE_LENGTH automatically (REJECTED)
- Try to make _bBoxAround smallest and increase it step by step to EDGE_LENGTH.
  It should helps us to use lesser innerPoints in _midPoint on hight density pointsets (DONE!)
- Check, fix and optimize intersection checking (DONE!)
- Update readme (DONE!)
- Create live examples on GitHub pages (DONE!)
- Fix problem in character example (DONE!)
- Compare performance with another concave hull implementations
- Update tests
- Push hull.js to npmjs.org
*/

/*
Optimization TODO:
- Replace RBush to simple grid and use only diff of bBoxes, not full bBox
*/

'use strict';

var rbush = require("rbush");
var intersect = require('./segments.js');
var grid = require('./grid.js');

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
        while (lower.length >= 2 && (_cross(lower[lower.length - 2], lower[lower.length - 1], pointset[l]) <= 0)) {
            lower.pop();
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
        while (upper.length >= 2 && (_cross(upper[upper.length - 2], upper[upper.length - 1], reversed[u]) <= 0)) {
            upper.pop();
        }
        upper.push(reversed[u]);
    }
    upper.pop();
    return upper;
}

function _cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); 
}

function _sqLength(a, b) {
    return Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2);
}

function _cos(o, a, b) {
    var aShifted = [a[0] - o[0], a[1] - o[1]],
        bShifted = [b[0] - o[0], b[1] - o[1]],
        sqALen = _sqLength(o, a),
        sqBLen = _sqLength(o, b),
        dot = aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1];

    return dot / Math.sqrt(sqALen * sqBLen);
}

function _intersect(edge, pointset) {
    for (var i = 0; i < pointset.length - 1; i++) {
        if (edge[0][0] === pointset[i][0] && edge[0][1] === pointset[i][1] ||
            edge[0][0] === pointset[i + 1][0] && edge[0][1] === pointset[i + 1][1]) {
            continue;
        }
        if (intersect(edge, [pointset[i], pointset[i + 1]])) {
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
    var point1 = null, point2 = null,
        angle1Cos = MAX_CONCAVE_ANGLE_COS,
        angle2Cos = MAX_CONCAVE_ANGLE_COS,
        a1Cos, a2Cos;

    for (var i = 0; i < innerPoints.length; i++) {
        a1Cos = _cos(edge[0], edge[1], innerPoints[i]);
        a2Cos = _cos(edge[1], edge[0], innerPoints[i]);

        if (a1Cos > MAX_CONCAVE_ANGLE_COS && a2Cos > MAX_CONCAVE_ANGLE_COS) {
            if ((a1Cos > angle1Cos && !_intersect([edge[0], innerPoints[i]], convex)) && 
                (a2Cos > angle2Cos && !_intersect([edge[1], innerPoints[i]], convex))) {

                angle1Cos = a1Cos;
                point1 = innerPoints[i];
                angle2Cos = a2Cos;
                point2 = innerPoints[i];
            }
        }
    }

    return angle1Cos > angle2Cos ? point1 : point2;
}

function _concave(convex, innerPointsTree, maxSqEdgeLen, maxSearchBBoxSize, grid) {
    var edge,
        nPoints,
        bBoxSize,
        midPoint,
        sqEdgeLen,
        bBoxAround,
        midPointInserted = false;

    for (var i = 0; i < convex.length - 1; i++) {
        edge = [convex[i], convex[i + 1]];
        sqEdgeLen = _sqLength(edge[0], edge[1]);

        if (sqEdgeLen < maxSqEdgeLen) { continue; }

        bBoxSize = MIN_SEARCH_BBOX_SIZE;
        
        var border = 0;
        bBoxAround = _bBoxAround(edge, bBoxSize);
        do {
            bBoxAround = grid.addBorder2Bbox(bBoxAround, border);
            bBoxSize = bBoxAround[2] - bBoxAround[0];
            nPoints = border > 0 ? grid.rangeBorderPoints(bBoxAround, 1) : grid.rangePoints(bBoxAround);
            midPoint = _midPoint(edge, nPoints, convex);
            border++;
        }  while (midPoint === null && maxSearchBBoxSize > bBoxSize);
        if (midPoint !== null) {
            convex.splice(i + 1, 0, midPoint);
            grid.removePoint(midPoint);
            midPointInserted = true;
        }

        // do {
        //     bBoxAround = _bBoxAround(edge, bBoxSize);
        //     nPoints = innerPointsTree.search(bBoxAround);
        //     midPoint = _midPoint(edge, nPoints, convex);
        //     bBoxSize *= 2;
        // } while (midPoint === null && maxSearchBBoxSize > bBoxSize);
        // if (midPoint !== null) {
        //     convex.splice(i + 1, 0, midPoint);
        //     innerPointsTree.remove(midPoint);
        //     midPointInserted = true;
        // }
    }

    if (midPointInserted) {
        return _concave(convex, innerPointsTree, maxSqEdgeLen, maxSearchBBoxSize, grid);
    }

    return convex;
}

function hull(pointset, concavity) {
    var lower, upper, convex,
        innerPoints,
        innerPointsTree,
        maxSearchBBoxSize,
        concavity = concavity || 10;

    if (pointset.length < 3) {
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

    var g = grid(innerPoints);
 
    innerPointsTree = rbush(9, ['[0]', '[1]', '[0]', '[1]']);
    innerPointsTree.load(innerPoints);
    
    return _concave(convex, innerPointsTree, Math.pow(concavity, 2), maxSearchBBoxSize, g);
}

var MAX_CONCAVE_ANGLE_COS = Math.cos(90 / (180 / Math.PI)); // angle = 90 deg
var MIN_SEARCH_BBOX_SIZE = 10;
var MAX_SEARCH_BBOX_SIZE_PERCENT = 0.8;

module.exports = hull;
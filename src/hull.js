/*
 (c) 2014, Andrey Geonya
 Hull.js, a JavaScript library for concave hull generation by set of points.
 https://github.com/AndreyGeonya/hull
*/

/*
 Papers:
 http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf
 http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
 http://martin-thoma.com/how-to-check-if-two-line-segments-intersect/
*/

'use strict';

function _sort(pixels) {
    pixels.sort(function(px1, px2) {
        return px1[0] - px2[0]; 
    });
    return pixels;
}

function _map(pixels) {
    var trios = [];
    for (var i = 0; i < pixels.length; i++) {
        if ((i + 1) % 3 === 0) {
            trios.push([pixels[i-2], pixels[i-1], pixels[i]]);
        }
    }
    return trios;
}

function _getUpperTangent(subset1, subset2) {
    var subs1RightPx = subset1[subset1.length - 1],
        subs2LeftPx = subset2[0],
        tangent = [subs1RightPx, subs2LeftPx];

    // walk top left (ccw) on subset1
    for (var i = subset1.length - 1; i >= 0 ; i--) {
        if (subset1[i][1] < subs1RightPx[1]) {
            if (subset1[i][1] > tangent[0][1]) { break; }
            tangent[0] = subset1[i];
        }
    }

    // walk top right (cw) on subset2
    for (var i = 0; i < subset2.length; i++) {
        if (subset2[i][1] < subs2LeftPx[1]) {
            if (subset2[i][1] > tangent[1][1]) { break; }
            tangent[1] = subset2[i];
        }
    }

    return tangent;
}

function _getLowerTangent(subset1, subset2) {
    var subs1RightPx = subset1[subset1.length - 1],
        subs2LeftPx = subset2[0],
        tangent = [subs1RightPx, subs2LeftPx];

    // walk bottom left (cw) on subset1
    for (var i = subset1.length - 1; i >= 0 ; i--) {
        if (subset1[i][1] > subs1RightPx[1]) {
            if (subset1[i][1] < tangent[0][1]) { break; }
            tangent[0] = subset1[i];
        }
    }

    // walk bottom right (ccw) on subset2
    for (var i = 0; i < subset2.length; i++) {
        if (subset2[i][1] > subs2LeftPx[1]) {
            if (subset2[i][1] < tangent[1][1]) { break; }
            tangent[1] = subset2[i];
        }
    }

    return tangent;
}

function _reduce(subsets, ctx) {
    return subsets.reduce(function(subset1, subset2) {
        // var subset1 = subsets[0],
        //     subset2 = subsets[1];

        var hull = [],
            upperTangent = _getUpperTangent(subset1, subset2),
            lowerTangent = _getLowerTangent(subset1, subset2);

        return [upperTangent[0], upperTangent[1], lowerTangent[1], lowerTangent[0]];

        // draw
        // ctx.beginPath();
        // ctx.moveTo(upperTangent[0][0], upperTangent[0][1]);
        // ctx.lineTo(upperTangent[1][0], upperTangent[1][1]);
        // ctx.stroke();
        // ctx.closePath();

        // ctx.beginPath();
        // ctx.moveTo(lowerTangent[0][0], lowerTangent[0][1]);
        // ctx.lineTo(lowerTangent[1][0], lowerTangent[1][1]);
        // ctx.stroke();
        // ctx.closePath();
    });
}

function hull(pixels, ctx) {
    var pxs = _sort(pixels.slice(0));
    return _reduce(_map(pxs), ctx);
}




// var Delaunay = require('./delaunay');

// function hull(pixels, tolerance) {
//     var tIdxs = Delaunay.triangulate(pixels),
//         tol = tolerance || 50,
//         sqTolerance = tol * tol,
//         edges2TriCount = _edges2TriCount(pixels, tIdxs, sqTolerance),
//         boundaryEdges = _getBoundaryEdges(edges2TriCount);

//     return _edges2cwPoly(boundaryEdges);
// }

// function _squaredDist(px1, px2) {
//     var dx = px1[0] - px2[0],
//         dy = px1[1] - px2[1];
//     return dx * dx + dy * dy;
// }

// function _edges2cwPoly(edges) {
//     var maxJ = Math.pow(edges.length, 2),
//         j = 0,
//         checked = {},
//         poly = [],
//         edge = edges[0];

//     checked[edge[0] + '-' + edge[1]] = true;
//     poly.push(edge[1]);
    
//     while (poly.length !== edges.length) {
//         for (var i = 0; i < edges.length; i++) {
//             var nextEdge = edges[i],
//                 k = nextEdge[0] + '-' + nextEdge[1];
//             if (checked[k] === true) {
//                 continue;
//             }
//             if (nextEdge[0] === edge[1] || nextEdge[1] === edge[1]) {
//                 if (nextEdge[0] === edge[1]) {
//                     poly.push(nextEdge[1]);
//                 }
//                 if (nextEdge[1] === edge[1]) {
//                     poly.push(nextEdge[0]);
//                 }
//                 edge = nextEdge;
//                 checked[k] = true;
//                 break;
//             }
//             j++;
//         }
//         if (j >= maxJ) {
//             break; // stop infinity loop for multipolygons
//         }
//     }

//     return poly;
// }

// function _edges2TriCount(pixels, tIdxs, sqTolerance) {
//     var trianglesInEdge = {},
//         incTriCount = function(a, b) {
//             var key = a + '-' + b;
//             trianglesInEdge[key] = trianglesInEdge[key] === undefined ? [1, a, b] : 
//             trianglesInEdge[key][0] + 1;
//         };

//     for (var i = tIdxs.length; i; ) {
//         var tIdx = [];

//         --i; tIdx[0] = tIdxs[i];
//         --i; tIdx[1] = tIdxs[i];
//         --i; tIdx[2] = tIdxs[i];

//         if (_squaredDist(pixels[tIdx[0]], pixels[tIdx[1]]) < sqTolerance &&
//             _squaredDist(pixels[tIdx[0]], pixels[tIdx[2]]) < sqTolerance &&
//             _squaredDist(pixels[tIdx[1]], pixels[tIdx[2]]) < sqTolerance) {

//             incTriCount(tIdx[0], tIdx[1]);
//             incTriCount(tIdx[1], tIdx[0]);
//             incTriCount(tIdx[1], tIdx[2]);
//             incTriCount(tIdx[2], tIdx[1]);
//             incTriCount(tIdx[2], tIdx[0]);
//             incTriCount(tIdx[0], tIdx[2]);
//         }
//     }

//     return trianglesInEdge;
// }

// function _getBoundaryEdges(edges2TriCount) {
//     var boundaryEdges = [];

//     for (var edge in edges2TriCount) {
//         if (edges2TriCount[edge][0] === 1) {
//             var pxs = [edges2TriCount[edge][1], edges2TriCount[edge][2]];
//             delete edges2TriCount[pxs[1] + '-' + pxs[0]];
//             boundaryEdges.push([pxs[0], pxs[1]]);
//         }
//     }

//     return boundaryEdges;
// }

// module.exports = hull;
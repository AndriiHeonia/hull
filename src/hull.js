/*
 (c) 2014, Andrey Geonya
 Hull.js, a JavaScript library for concave hull generation by set of points.
 https://github.com/AndreyGeonya/hull
*/

'use strict';

var Delaunay = require('./delaunay');

function hull(pixels, tolerance, ctx) {
    var tIdxs = Delaunay.triangulate(pixels),
        tol = tolerance || 50,
        sqTolerance = tol * tol,
        edges2TriCount = _edges2TriCount(pixels, tIdxs, sqTolerance),
        boundaryEdges = _getBoundaryEdges(edges2TriCount);

    _drawTriangles(pixels, sqTolerance, ctx);

    return _edges2cwPoly(boundaryEdges);
}

function _squaredDist(px1, px2) {
    var dx = px1[0] - px2[0],
        dy = px1[1] - px2[1];
    return dx * dx + dy * dy;
}

function _edges2cwPoly(edges) {
    var maxJ = Math.pow(edges.length, 2),
        j = 0,
        checked = {},
        poly = [],
        edge = edges[0];

    checked[edge[0] + '-' + edge[1]] = true;
    poly.push(edge[1]);
    
    while (poly.length !== edges.length) {
        for (var i = 0; i < edges.length; i++) {
            var nextEdge = edges[i],
                k = nextEdge[0] + '-' + nextEdge[1];
            if (checked[k] === true) {
                continue;
            }
            if (nextEdge[0] === edge[1] || nextEdge[1] === edge[1]) {
                if (nextEdge[0] === edge[1]) {
                    poly.push(nextEdge[1]);
                }
                if (nextEdge[1] === edge[1]) {
                    poly.push(nextEdge[0]);
                }
                edge = nextEdge;
                checked[k] = true;
                break;
            }
            j++;
        }
        if (j >= maxJ) {
            break; // stop infinity loop for multipolygons
        }
    }

    return poly;
}

function _edges2TriCount(pixels, tIdxs, sqTolerance) {
    var trianglesInEdge = {},
        incTriCount = function(a, b) {
            var key = a + '-' + b;
            trianglesInEdge[key] = trianglesInEdge[key] === undefined ? [1, a, b] : 
            trianglesInEdge[key][0] + 1;
        };

    for (var i = tIdxs.length; i; ) {
        var tIdx = [];

        --i; tIdx[0] = tIdxs[i];
        --i; tIdx[1] = tIdxs[i];
        --i; tIdx[2] = tIdxs[i];

        if (_squaredDist(pixels[tIdx[0]], pixels[tIdx[1]]) < sqTolerance &&
            _squaredDist(pixels[tIdx[0]], pixels[tIdx[2]]) < sqTolerance &&
            _squaredDist(pixels[tIdx[1]], pixels[tIdx[2]]) < sqTolerance) {

            incTriCount(tIdx[0], tIdx[1]);
            incTriCount(tIdx[1], tIdx[0]);
            incTriCount(tIdx[1], tIdx[2]);
            incTriCount(tIdx[2], tIdx[1]);
            incTriCount(tIdx[2], tIdx[0]);
            incTriCount(tIdx[0], tIdx[2]);
        }
    }

    return trianglesInEdge;
}

function _getBoundaryEdges(edges2TriCount) {
    var boundaryEdges = [];

    for (var edge in edges2TriCount) {
        if (edges2TriCount[edge][0] === 1) {
            var pxs = [edges2TriCount[edge][1], edges2TriCount[edge][2]];
            delete edges2TriCount[pxs[1] + '-' + pxs[0]];
            boundaryEdges.push([pxs[0], pxs[1]]);
        }
    }

    return boundaryEdges;
}

function _drawPx(x, y, color) {
    if (window.hull.DEBUG === false) {
        return;
    }
    var ctx = window.hull.DEBUG;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
}

function _drawTriangles(vertices, sqTolerance, ctx) {
    var tIdxs = Delaunay.triangulate(vertices),
        triangles = [];

    for (var i = tIdxs.length; i; ) {
        var tIdx = [];
        --i; tIdx[0] = tIdxs[i];
        --i; tIdx[1] = tIdxs[i];
        --i; tIdx[2] = tIdxs[i];
        if (_squaredDist(vertices[tIdx[0]], vertices[tIdx[1]]) < sqTolerance &&
            _squaredDist(vertices[tIdx[0]], vertices[tIdx[2]]) < sqTolerance &&
            _squaredDist(vertices[tIdx[1]], vertices[tIdx[2]]) < sqTolerance) {
            triangles.push(tIdx);
        }
    }

    triangles.forEach(function(i) {
        var p1X = vertices[i[0]][0],
            p1Y = vertices[i[0]][1];
        ctx.moveTo(p1X, p1Y);
        var p2X = vertices[i[1]][0],
            p2Y = vertices[i[1]][1];
        ctx.lineTo(p2X, p2Y);
        var p3X = vertices[i[2]][0],
            p3Y = vertices[i[2]][1];
        ctx.lineTo(p3X, p3Y);
        ctx.closePath();
        ctx.stroke();
    });
}

module.exports = hull;
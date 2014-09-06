!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.hull=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Delaunay;

(function() {
  "use strict";

  var EPSILON = 1.0 / 1048576.0;

  function supertriangle(vertices) {
    var xmin = Number.POSITIVE_INFINITY,
        ymin = Number.POSITIVE_INFINITY,
        xmax = Number.NEGATIVE_INFINITY,
        ymax = Number.NEGATIVE_INFINITY,
        i, dx, dy, dmax, xmid, ymid;

    for(i = vertices.length; i--; ) {
      if(vertices[i][0] < xmin) xmin = vertices[i][0];
      if(vertices[i][0] > xmax) xmax = vertices[i][0];
      if(vertices[i][1] < ymin) ymin = vertices[i][1];
      if(vertices[i][1] > ymax) ymax = vertices[i][1];
    }

    dx = xmax - xmin;
    dy = ymax - ymin;
    dmax = Math.max(dx, dy);
    xmid = xmin + dx * 0.5;
    ymid = ymin + dy * 0.5;

    return [
      [xmid - 20 * dmax, ymid -      dmax],
      [xmid            , ymid + 20 * dmax],
      [xmid + 20 * dmax, ymid -      dmax]
    ];
  }

  function circumcircle(vertices, i, j, k) {
    var x1 = vertices[i][0],
        y1 = vertices[i][1],
        x2 = vertices[j][0],
        y2 = vertices[j][1],
        x3 = vertices[k][0],
        y3 = vertices[k][1],
        fabsy1y2 = Math.abs(y1 - y2),
        fabsy2y3 = Math.abs(y2 - y3),
        xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

    /* Check for coincident points */
    if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
      throw new Error("Eek! Coincident points!");

    if(fabsy1y2 < EPSILON) {
      m2  = -((x3 - x2) / (y3 - y2));
      mx2 = (x2 + x3) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc  = (x2 + x1) / 2.0;
      yc  = m2 * (xc - mx2) + my2;
    }

    else if(fabsy2y3 < EPSILON) {
      m1  = -((x2 - x1) / (y2 - y1));
      mx1 = (x1 + x2) / 2.0;
      my1 = (y1 + y2) / 2.0;
      xc  = (x3 + x2) / 2.0;
      yc  = m1 * (xc - mx1) + my1;
    }

    else {
      m1  = -((x2 - x1) / (y2 - y1));
      m2  = -((x3 - x2) / (y3 - y2));
      mx1 = (x1 + x2) / 2.0;
      mx2 = (x2 + x3) / 2.0;
      my1 = (y1 + y2) / 2.0;
      my2 = (y2 + y3) / 2.0;
      xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
      yc  = (fabsy1y2 > fabsy2y3) ?
        m1 * (xc - mx1) + my1 :
        m2 * (xc - mx2) + my2;
    }

    dx = x2 - xc;
    dy = y2 - yc;
    return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
  }

  function dedup(edges) {
    var i, j, a, b, m, n;

    for(j = edges.length; j; ) {
      b = edges[--j];
      a = edges[--j];

      for(i = j; i; ) {
        n = edges[--i];
        m = edges[--i];

        if((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2);
          edges.splice(i, 2);
          break;
        }
      }
    }
  }

  Delaunay = {
    triangulate: function(vertices, key) {
      var n = vertices.length,
          i, j, indices, st, open, closed, edges, dx, dy, a, b, c;

      /* Bail if there aren't enough vertices to form any triangles. */
      if(n < 3)
        return [];

      /* Slice out the actual vertices from the passed objects. (Duplicate the
       * array even if we don't, though, since we need to make a supertriangle
       * later on!) */
      vertices = vertices.slice(0);

      if(key)
        for(i = n; i--; )
          vertices[i] = vertices[i][key];

      /* Make an array of indices into the vertex array, sorted by the
       * vertices' x-position. */
      indices = new Array(n);

      for(i = n; i--; )
        indices[i] = i;

      indices.sort(function(i, j) {
        return vertices[j][0] - vertices[i][0];
      });

      /* Next, find the vertices of the supertriangle (which contains all other
       * triangles), and append them onto the end of a (copy of) the vertex
       * array. */
      st = supertriangle(vertices);
      vertices.push(st[0], st[1], st[2]);
      
      /* Initialize the open list (containing the supertriangle and nothing
       * else) and the closed list (which is empty since we havn't processed
       * any triangles yet). */
      open   = [circumcircle(vertices, n + 0, n + 1, n + 2)];
      closed = [];
      edges  = [];

      /* Incrementally add each vertex to the mesh. */
      for(i = indices.length; i--; edges.length = 0) {
        c = indices[i];

        /* For each open triangle, check to see if the current point is
         * inside it's circumcircle. If it is, remove the triangle and add
         * it's edges to an edge list. */
        for(j = open.length; j--; ) {
          /* If this point is to the right of this triangle's circumcircle,
           * then this triangle should never get checked again. Remove it
           * from the open list, add it to the closed list, and skip. */
          dx = vertices[c][0] - open[j].x;
          if(dx > 0.0 && dx * dx > open[j].r) {
            closed.push(open[j]);
            open.splice(j, 1);
            continue;
          }

          /* If we're outside the circumcircle, skip this triangle. */
          dy = vertices[c][1] - open[j].y;
          if(dx * dx + dy * dy - open[j].r > EPSILON)
            continue;

          /* Remove the triangle and add it's edges to the edge list. */
          edges.push(
            open[j].i, open[j].j,
            open[j].j, open[j].k,
            open[j].k, open[j].i
          );
          open.splice(j, 1);
        }

        /* Remove any doubled edges. */
        dedup(edges);

        /* Add a new triangle for each edge. */
        for(j = edges.length; j; ) {
          b = edges[--j];
          a = edges[--j];
          open.push(circumcircle(vertices, a, b, c));
        }
      }

      /* Copy any remaining open triangles to the closed list, and then
       * remove any triangles that share a vertex with the supertriangle,
       * building a list of triplets that represent triangles. */
      for(i = open.length; i--; )
        closed.push(open[i]);
      open.length = 0;

      for(i = closed.length; i--; )
        if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
          open.push(closed[i].i, closed[i].j, closed[i].k);

      /* Yay, we're done! */
      return open;
    },
    contains: function(tri, p) {
      /* Bounding box test first, for quick rejections. */
      if((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
         (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
         (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
         (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]))
        return null;

      var a = tri[1][0] - tri[0][0],
          b = tri[2][0] - tri[0][0],
          c = tri[1][1] - tri[0][1],
          d = tri[2][1] - tri[0][1],
          i = a * d - b * c;

      /* Degenerate tri. */
      if(i === 0.0)
        return null;

      var u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
          v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;

      /* If we're outside the tri, fail. */
      if(u < 0.0 || v < 0.0 || (u + v) > 1.0)
        return null;

      return [u, v];
    }
  };

  if(typeof module !== "undefined")
    module.exports = Delaunay;
})();

},{}],2:[function(require,module,exports){
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
        boundaryEdges = _getBoundaryEdges(edges2TriCount, ctx, pixels);

    // _drawTriangles(pixels, sqTolerance, ctx);

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

function _getBoundaryEdges(edges2TriCount, ctx, pixels) {
    var boundaryEdges = [];

    for (var edge in edges2TriCount) {
        if (edges2TriCount[edge][0] === 1) {
            var pxs = [edges2TriCount[edge][1], edges2TriCount[edge][2]];
            delete edges2TriCount[pxs[1] + '-' + pxs[0]];
            boundaryEdges.push([pxs[0], pxs[1]]);
            // _drawPx(pixels[pxs[0]][0], pixels[pxs[0]][1], 'blue', ctx);
            // _drawPx(pixels[pxs[1]][0], pixels[pxs[1]][1], 'blue', ctx);
        }
    }

    return boundaryEdges;
}

function _drawPx(x, y, color, ctx) {
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
},{"./delaunay":1}]},{},[2])(2)
});
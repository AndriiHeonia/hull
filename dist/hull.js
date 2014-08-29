(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"

module.exports = fastTwoSum

function fastTwoSum(a, b, result) {
	var x = a + b
	var bv = x - a
	var av = x - bv
	var br = b - bv
	var ar = a - av
	if(result) {
		result[0] = ar + br
		result[1] = x
		return result
	}
	return [ar+br, x]
}
},{}],2:[function(require,module,exports){
"use strict"

var twoProduct = require("two-product")
var twoSum = require("two-sum")

module.exports = scaleLinearExpansion

function scaleLinearExpansion(e, scale) {
  var n = e.length
  if(n === 1) {
    var ts = twoProduct(e[0], scale)
    if(ts[0]) {
      return ts
    }
    return [ ts[1] ]
  }
  var g = new Array(2 * n)
  var q = [0.1, 0.1]
  var t = [0.1, 0.1]
  var count = 0
  twoProduct(e[0], scale, q)
  if(q[0]) {
    g[count++] = q[0]
  }
  for(var i=1; i<n; ++i) {
    twoProduct(e[i], scale, t)
    var pq = q[1]
    twoSum(pq, t[0], q)
    if(q[0]) {
      g[count++] = q[0]
    }
    var a = t[1]
    var b = q[1]
    var x = a + b
    var bv = x - a
    var y = b - bv
    q[1] = x
    if(y) {
      g[count++] = y
    }
  }
  if(q[1]) {
    g[count++] = q[1]
  }
  if(count === 0) {
    g[count++] = 0.0
  }
  g.length = count
  return g
}
},{"two-product":5,"two-sum":1}],3:[function(require,module,exports){
"use strict"

module.exports = robustSubtract

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function robustSubtract(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], -f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = -f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = -f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}
},{}],4:[function(require,module,exports){
"use strict"

module.exports = linearExpansionSum

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function linearExpansionSum(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}
},{}],5:[function(require,module,exports){
"use strict"

module.exports = twoProduct

var SPLITTER = +(Math.pow(2, 27) + 1.0)

function twoProduct(a, b, result) {
  var x = a * b

  var c = SPLITTER * a
  var abig = c - a
  var ahi = c - abig
  var alo = a - ahi

  var d = SPLITTER * b
  var bbig = d - b
  var bhi = d - bbig
  var blo = b - bhi

  var err1 = x - (ahi * bhi)
  var err2 = err1 - (alo * bhi)
  var err3 = err2 - (ahi * blo)

  var y = alo * blo - err3

  if(result) {
    result[0] = y
    result[1] = x
    return result
  }

  return [ y, x ]
}
},{}],6:[function(require,module,exports){
"use strict"

var twoProduct = require("two-product")
var robustSum = require("robust-sum")
var robustScale = require("robust-scale")
var robustSubtract = require("robust-subtract")

var NUM_EXPAND = 5

var EPSILON     = 1.1102230246251565e-16
var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON
var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON

function cofactor(m, c) {
  var result = new Array(m.length-1)
  for(var i=1; i<m.length; ++i) {
    var r = result[i-1] = new Array(m.length-1)
    for(var j=0,k=0; j<m.length; ++j) {
      if(j === c) {
        continue
      }
      r[k++] = m[i][j]
    }
  }
  return result
}

function matrix(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = new Array(n)
    for(var j=0; j<n; ++j) {
      result[i][j] = ["m", j, "[", (n-i-1), "]"].join("")
    }
  }
  return result
}

function sign(n) {
  if(n & 1) {
    return "-"
  }
  return ""
}

function generateSum(expr) {
  if(expr.length === 1) {
    return expr[0]
  } else if(expr.length === 2) {
    return ["sum(", expr[0], ",", expr[1], ")"].join("")
  } else {
    var m = expr.length>>1
    return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
  }
}

function determinant(m) {
  if(m.length === 2) {
    return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
  } else {
    var expr = []
    for(var i=0; i<m.length; ++i) {
      expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""))
    }
    return expr
  }
}

function orientation(n) {
  var pos = []
  var neg = []
  var m = matrix(n)
  var args = []
  for(var i=0; i<n; ++i) {
    if((i&1)===0) {
      pos.push.apply(pos, determinant(cofactor(m, i)))
    } else {
      neg.push.apply(neg, determinant(cofactor(m, i)))
    }
    args.push("m" + i)
  }
  var posExpr = generateSum(pos)
  var negExpr = generateSum(neg)
  var funcName = "orientation" + n + "Exact"
  var code = ["function ", funcName, "(", args.join(), "){var p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("")
  var proc = new Function("sum", "prod", "scale", "sub", code)
  return proc(robustSum, twoProduct, robustScale, robustSubtract)
}

var orientation3Exact = orientation(3)
var orientation4Exact = orientation(4)

var CACHED = [
  function orientation0() { return 0 },
  function orientation1() { return 0 },
  function orientation2(a, b) { 
    return b[0] - a[0]
  },
  function orientation3(a, b, c) {
    var l = (a[1] - c[1]) * (b[0] - c[0])
    var r = (a[0] - c[0]) * (b[1] - c[1])
    var det = l - r
    var s
    if(l > 0) {
      if(r <= 0) {
        return det
      } else {
        s = l + r
      }
    } else if(l < 0) {
      if(r >= 0) {
        return det
      } else {
        s = -(l + r)
      }
    } else {
      return det
    }
    var tol = ERRBOUND3 * s
    if(det >= tol || det <= -tol) {
      return det
    }
    return orientation3Exact(a, b, c)
  },
  function orientation4(a,b,c,d) {
    var adx = a[0] - d[0]
    var bdx = b[0] - d[0]
    var cdx = c[0] - d[0]
    var ady = a[1] - d[1]
    var bdy = b[1] - d[1]
    var cdy = c[1] - d[1]
    var adz = a[2] - d[2]
    var bdz = b[2] - d[2]
    var cdz = c[2] - d[2]
    var bdxcdy = bdx * cdy
    var cdxbdy = cdx * bdy
    var cdxady = cdx * ady
    var adxcdy = adx * cdy
    var adxbdy = adx * bdy
    var bdxady = bdx * ady
    var det = adz * (bdxcdy - cdxbdy) 
            + bdz * (cdxady - adxcdy)
            + cdz * (adxbdy - bdxady)
    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz)
    var tol = ERRBOUND4 * permanent
    if ((det > tol) || (-det > tol)) {
      return det
    }
    return orientation4Exact(a,b,c,d)
  }
]

function slowOrient(args) {
  var proc = CACHED[args.length]
  if(!proc) {
    proc = CACHED[args.length] = orientation(args.length)
  }
  return proc.apply(undefined, args)
}

function generateOrientationProc() {
  while(CACHED.length <= NUM_EXPAND) {
    CACHED.push(orientation(CACHED.length))
  }
  var args = []
  var procArgs = ["slow"]
  for(var i=0; i<=NUM_EXPAND; ++i) {
    args.push("a" + i)
    procArgs.push("o" + i)
  }
  var code = [
    "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
  ]
  for(var i=2; i<=NUM_EXPAND; ++i) {
    code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");")
  }
  code.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation")
  procArgs.push(code.join(""))

  var proc = Function.apply(undefined, procArgs)
  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED))
  for(var i=0; i<=NUM_EXPAND; ++i) {
    module.exports[i] = CACHED[i]
  }
}

generateOrientationProc()
},{"robust-scale":2,"robust-subtract":3,"robust-sum":4,"two-product":5}],7:[function(require,module,exports){
"use strict"

module.exports = segmentsIntersect

var orient = require("robust-orientation")[3]

function checkCollinear(a0, a1, b0, b1) {

  for(var d=0; d<2; ++d) {
    var x0 = a0[d]
    var y0 = a1[d]
    var l0 = Math.min(x0, y0)
    var h0 = Math.max(x0, y0)    

    var x1 = b0[d]
    var y1 = b1[d]
    var l1 = Math.min(x1, y1)
    var h1 = Math.max(x1, y1)    

    if(h1 < l0 || h0 < l1) {
      return false
    }
  }

  return true
}

function segmentsIntersect(a0, a1, b0, b1) {
  var x0 = orient(a0, b0, b1)
  var y0 = orient(a1, b0, b1)
  if((x0 > 0 && y0 > 0) || (x0 < 0 && y0 < 0)) {
    return false
  }

  var x1 = orient(b0, a0, a1)
  var y1 = orient(b1, a0, a1)
  if((x1 > 0 && y1 > 0) || (x1 < 0 && y1 < 0)) {
    return false
  }

  //Check for degenerate collinear case
  if(x0 === 0 && y0 === 0 && x1 === 0 && y1 === 0) {
    return checkCollinear(a0, a1, b0, b1)
  }

  return true
}
},{"robust-orientation":6}],8:[function(require,module,exports){
var crosses = require('robust-segment-intersect');

(function(){

function _getDistance(px1, px2) {
    return Math.sqrt(Math.pow(px2.x - px1.x, 2) + Math.pow(px2.y - px1.y, 2));
}

function _getBbox(pixels) {
    var bbox = {
        xl:Infinity,
        xr:0,
        yt:Infinity,
        yb:0
    };

    pixels.forEach(function(px){
        if (px.x > bbox.xr) {
            bbox.xr = px.x;
        }
        if (px.x < bbox.xl) {
            bbox.xl = px.x;
        }
        if (px.y > bbox.yb) {
            bbox.yb = px.y;
        }
        if (px.y < bbox.yt) {
            bbox.yt = px.y;
        }
    });

    return bbox;
}

function _getBottomPx(diagram) {
    var px = {
        x: -Infinity,
        y: -Infinity
    };

    for (var i = 0; i < diagram.cells.length; i++) {
        if (diagram.cells[i].site.y > px.y) {
            px = diagram.cells[i].site;
        }
    }

    return px;
}

function _intersects(line, polyline) {
    var x1 = line[0].x,
        y1 = line[0].y,
        x2 = line[1].x,
        y2 = line[1].y;

    for (var i = 0; i < polyline.length-1; i++) {
        var x3 = polyline[i].x,
            y3 = polyline[i].y,
            x4 = polyline[i+1].x,
            y4 = polyline[i+1].y;

        // they don't intersect, they have common vertice (touch each other)
        // Эта проверка не катит, так как она skip-ает весь сегмент, хотя сегмент
        // может пересекаться с полилайном и вне общей точки, а такое пересечение это уже true
        if (line[0].voronoiId == polyline[i].voronoiId ||
            line[1].voronoiId == polyline[i].voronoiId ||
            line[0].voronoiId == polyline[i+1].voronoiId ||
            line[1].voronoiId == polyline[i+1].voronoiId
        ) { continue; }

        if (crosses([x1, y1], [x2, y2], [x3, y3], [x4, y4])) {
            return true;
        }
    }
    return false;
}

function _getNeighbors(vertice, diagram, visited, k) {
    var nPxs = [],
        halfedge,
        lSite,
        rSite,
        k = k || 2,
        queue = [],
        inQueue = {},
        voronoiId;

    queue.push(vertice.voronoiId);
    inQueue[vertice.voronoiId] = true;

    while (nPxs.length < k) {
        voronoiId = queue.shift();
        if (voronoiId === undefined) {
            break;
        }

        for (var i = 0; i < diagram.cells[voronoiId].halfedges.length; i++) {
            halfedge = diagram.cells[voronoiId].halfedges[i];
            lSite = halfedge.edge.lSite;
            rSite = halfedge.edge.rSite;

            if (lSite && lSite.voronoiId !== voronoiId) {
                if (inQueue[lSite.voronoiId] !== true) {
                    inQueue[lSite.voronoiId] = true;
                    queue.push(lSite.voronoiId);
                }
                if (visited[lSite.voronoiId] !== true) {
                    nPxs.push(lSite);
                }
            }
            if (rSite && rSite.voronoiId !== voronoiId) {
                if (inQueue[rSite.voronoiId] !== true) {
                    queue.push(rSite.voronoiId);
                    inQueue[rSite.voronoiId] = true;
                }
                if (visited[rSite.voronoiId] !== true) {
                    nPxs.push(rSite);
                }
            }
        }
    }
    return nPxs;
}

function _getAngle(px1, px2) {
    var xDiff = px2.x - px1.x,
        yDiff = px2.y - px1.y,
        angle = Math.atan2(yDiff, xDiff) * (180 / Math.PI);

    if (angle == 180) {
        angle = 0;
    } else {
        angle += 180
    }

    return angle; //(angle < 0 ? angle + 360 : angle);
}

function _getMostRightPx(originPx, pixels) {
    var maxAngle = 0,
        px = null;

    for (var i = 0; i < pixels.length; i++) {
        var a = _getAngle(originPx, pixels[i]);
        if (a > maxAngle) {
            maxAngle = a;
            px = pixels[i];
        }
    }

    return px;
}

function _drawNet(diagram) {
    // сетка
    for (var i = 0; i < diagram.cells.length; i++) {
        for (var j = 0; j < diagram.cells[i].halfedges.length; j++) {
            var halfedge = diagram.cells[i].halfedges[j];
            ctx.beginPath();
            ctx.moveTo(halfedge.edge.va.x, halfedge.edge.va.y);
            ctx.lineTo(halfedge.edge.vb.x, halfedge.edge.vb.y);
            ctx.stroke();
            ctx.closePath();
        };
    }
}

function _drawPoints(currentPx, currentNPxs, mostRightNPx) {
    // hull-точка
    if (currentPx !== undefined) {
        ctx.fillStyle="blue";
        ctx.beginPath();
        ctx.arc(currentPx.x, currentPx.y, 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
    }

    // соседи
    if (currentNPxs !== undefined && currentNPxs.length > 0) {
        ctx.fillStyle="yellow";
        currentNPxs.forEach(function(px) {
            ctx.beginPath();
            ctx.arc(px.x, px.y, 2, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();
        });
    }

    // самый правый сосед
    if (mostRightNPx !== undefined) {
        ctx.fillStyle="green";
        ctx.beginPath();
        ctx.arc(mostRightNPx.x, mostRightNPx.y, 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
    }
}

window.hull = function(pixels) {
    var voronoi = new Voronoi(),
        diagram = voronoi.compute(pixels, _getBbox(pixels)),
        startPx = currentPx = _getBottomPx(diagram),
        visited = {},
        currentNPxs = _getNeighbors(currentPx, diagram, visited),
        mostRightNPx = _getMostRightPx(currentPx, currentNPxs),
        result = [startPx];

    _drawNet(diagram);

    visited[currentPx.voronoiId] = true;
    while (mostRightNPx.voronoiId !== startPx.voronoiId) { // TODO: эта проверка не сработает
        // debugger;

        currentPx = mostRightNPx;
        _drawPoints(currentPx, undefined, undefined);
        visited[currentPx.voronoiId] = true;
        
        function _getAndFilterNPxs(k) {
            var res = _getNeighbors(currentPx, diagram, visited, k);
            res = res.filter(function(nPx) {
                var line = [result[result.length-1], nPx],
                    polyline = result.slice(0, result.length-1);

                    // polyline.push(startPx);
                return !_intersects(line, polyline);
            });
            return res;
        }

        // $ node_modules/browserify/bin/cmd.js ./src/hull.js -o ./dist/hull.js

        currentNPxs = _getAndFilterNPxs(2);
        if (currentNPxs.length===0) {
            currentNPxs = _getAndFilterNPxs(4); // к какому соседу бы ты не пошел, будет intersect
            // TODO: попробовать замкнуть полигон перед проверкой intersect-а
            // Надо научить метод intersect проверять, пересекаются ли сегменты только вне общей точки,
            // тогда мы сможем сделать так чтоб линия не "загибалась" внутрь полигона
        }
  
        _drawPoints(undefined, currentNPxs, undefined);

        if (!currentNPxs.length) { console.log('Last: ', currentPx); return result; }

        mostRightNPx = _getMostRightPx(currentPx, currentNPxs);

        _drawPoints(undefined, undefined, mostRightNPx);


        result.push(mostRightNPx);
    }

    return result;
}

})();
},{"robust-segment-intersect":7}]},{},[8]);

(function() {

function _dsq(a, b) {
    var dx = a[0] - b[0], dy = a[1] - b[1];
    return dx * dx + dy * dy;
}

// http://stackoverflow.com/questions/14108553/get-border-edges-of-mesh-in-winding-order#comment19522625_14108553
// TODO: construct multipolygons before sorting. Think about clusters.
// TODO: think about O(N^2) optimization
function _edges2Border(edges) {
    var checked = {},
        border = [],
        edge = edges[0],
        nextEdge,
        j = 0;

    checked[edge[0] + '-' + edge[1]] = true;
    border.push(edge[1]);
    
    while (border.length !== edges.length) {
        // templary infinity loop break for multipolygons
        if (j > Math.pow(edges.length, 2)) {
            break;
        }
        for (var i = 0; i < edges.length; i++) {
            j++;
            var nextEdge = edges[i],
                k = nextEdge[0] + '-' + nextEdge[1];

            if (checked[k] === true) {
                continue;
            }

            if (nextEdge[0] === edge[1] || nextEdge[1] === edge[1]) {
                if (nextEdge[0] === edge[1]) {
                    border.push(nextEdge[1]);
                }
                if (nextEdge[1] === edge[1]) {
                    border.push(nextEdge[0]);
                }
                edge = nextEdge;
                checked[k] = true;
                break;
            }
        }
    }

    return border;
}

function hull(vertices, alpha) {
    var tIdxs = Delaunay.triangulate(vertices),
        trianglesInEdge = {},
        borderEdges = [],
        alpha = alpha || 50,
        asq = alpha * alpha,
        addKeyToHash = function(key) {
            trianglesInEdge[key] = trianglesInEdge[key] === undefined ? 1 : trianglesInEdge[key] + 1;
        };

    // count how many triangles related with each edge
    for (var i = tIdxs.length; i; ) {
        var tIdx = [];

        --i; tIdx[0] = tIdxs[i];
        --i; tIdx[1] = tIdxs[i];
        --i; tIdx[2] = tIdxs[i];

        if (_dsq(vertices[tIdx[0]], vertices[tIdx[1]]) < asq &&
            _dsq(vertices[tIdx[0]], vertices[tIdx[2]]) < asq &&
            _dsq(vertices[tIdx[1]], vertices[tIdx[2]]) < asq) {

            addKeyToHash(tIdx[0] + '-' + tIdx[1]);
            addKeyToHash(tIdx[1] + '-' + tIdx[0]);
            addKeyToHash(tIdx[1] + '-' + tIdx[2]);
            addKeyToHash(tIdx[2] + '-' + tIdx[1]);
            addKeyToHash(tIdx[2] + '-' + tIdx[0]);
            addKeyToHash(tIdx[0] + '-' + tIdx[2]);
        }
    }

    // leave only border edges
    for (edge in trianglesInEdge) {
        if (trianglesInEdge[edge] === 1) {
            var pts = edge.split('-');
            delete trianglesInEdge[pts[1] + '-' + pts[0]];
            borderEdges.push([parseInt(pts[0]), parseInt(pts[1])]);

            _drawPx(vertices[pts[0]][0], vertices[pts[0]][1], 'red');
        }
    }

    _drawTriangles(vertices, asq);

    return _edges2Border(borderEdges);
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

function _drawTriangles(vertices, asq) {
    if (window.hull.DEBUG === false) {
        return;
    }

    var ctx = window.hull.DEBUG,
        tIdxs = Delaunay.triangulate(vertices),
        triangles = [];

    for (var i = tIdxs.length; i; ) {
        var tIdx = [];
        --i; tIdx[0] = tIdxs[i];
        --i; tIdx[1] = tIdxs[i];
        --i; tIdx[2] = tIdxs[i];
        if (_dsq(vertices[tIdx[0]], vertices[tIdx[1]]) < asq &&
            _dsq(vertices[tIdx[0]], vertices[tIdx[2]]) < asq &&
            _dsq(vertices[tIdx[1]], vertices[tIdx[2]]) < asq) {
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

window.hull = hull;
window.hull.DEBUG = false;

})();
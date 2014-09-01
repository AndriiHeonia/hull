(function(){

function dsq(a, b) {
    var dx = a[0] - b[0], dy = a[1] - b[1];
    return dx * dx + dy * dy;
}

function cmnTrianglesCount(idx, triangles) {
    var count = 0;

    for (var i = 0; i < triangles.length; i++) {
        if (idx === triangles[i][0] || 
            idx === triangles[i][1] ||
            idx === triangles[i][2]) {
            count++
        }
    }

    return count;
}

function hull(vertices, alpha) {
    var tIdxs = Delaunay.triangulate(vertices),
        triangles = [],
        border = [],
        trianglesInEdge = {},
        borderEdges = [],
        alpha = alpha || 50;

    // all triangles
    for (var i = tIdxs.length; i; ) {
        var tIdx = [],
            asq = alpha * alpha;
        
        --i; tIdx[0] = tIdxs[i];
        --i; tIdx[1] = tIdxs[i];
        --i; tIdx[2] = tIdxs[i];

        if (dsq(vertices[tIdx[0]], vertices[tIdx[1]]) < asq && dsq(vertices[tIdx[0]],vertices[tIdx[2]]) < asq && dsq(vertices[tIdx[1]],vertices[tIdx[2]]) < asq) {
            triangles.push(tIdx);
        }
    }

    // border
    //  TODO: I have to find edges that are only connected to one triangle
    // http://stackoverflow.com/questions/14108553/get-border-edges-of-mesh-in-winding-order#comment19522625_14108553

    var addKeyToHash = function(key) {
        trianglesInEdge[key] = trianglesInEdge[key] === undefined ? 1 : trianglesInEdge[key] + 1;
    }
    triangles.forEach(function(triangle) {
        addKeyToHash(triangle[0] + '-' + triangle[1]);
        addKeyToHash(triangle[1] + '-' + triangle[0]);
        addKeyToHash(triangle[1] + '-' + triangle[2]);
        addKeyToHash(triangle[2] + '-' + triangle[1]);
        addKeyToHash(triangle[2] + '-' + triangle[0]);
        addKeyToHash(triangle[0] + '-' + triangle[2]);
    });  

    for (edge in trianglesInEdge) {
        if (trianglesInEdge[edge] === 1) {
            var pts = edge.split('-');
            delete trianglesInEdge[pts[1] + '-' + pts[0]];
            
            borderEdges.push([pts[0], pts[1]]);

            ctx.fillStyle="red";
            ctx.beginPath();
            ctx.arc(vertices[pts[0]][0], vertices[pts[0]][1], 4, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();
        }
    }

    console.table(borderEdges);
    return triangles;
}

window.hull = hull;

})();
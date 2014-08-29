(function(){

function dsq(a, b) {
    var dx = a[0] - b[0], dy = a[1] - b[1];
    return dx * dx + dy * dy;
}

function hull(vertices, alpha) {
    var triangles = Delaunay.triangulate(vertices),
        result = [],
        alpha = alpha || 50;

    for (i = triangles.length; i; ) {
        var t = [],
            asq = alpha*alpha;

        --i; t[0] = [vertices[triangles[i]][0], vertices[triangles[i]][1]];
        --i; t[1] = [vertices[triangles[i]][0], vertices[triangles[i]][1]];
        --i; t[2] = [vertices[triangles[i]][0], vertices[triangles[i]][1]];

        if (dsq(t[0],t[1]) < asq && dsq(t[0],t[2]) < asq && dsq(t[1],t[2]) < asq) {
            result.push(t);
        }
    }

    return result;
}

window.hull = hull;

})();
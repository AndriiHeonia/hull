/*
 Papers:
 http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf
 http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
 http://martin-thoma.com/how-to-check-if-two-line-segments-intersect/
*/

function _sort(ps) {
    return ps.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] - b[1];                           
        } else {                                                    
            return a[0] - b[0];                                                           
        }                                                                                           
    });                                     
}

// see: http://allenchou.net/2013/07/cross-product-of-2d-vectors/
function _cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); 
}

function _upperTangent(pointset) {
    var lower = [];
    for (var l = 0; l < pointset.length; l++) {
        while (lower.length >= 2 && (_cross(lower[lower.length - 2], lower[lower.length - 1], pointset[l]) <= 0)) {
            lower.pop();
        }
        lower.push(pointset[l]);

        // debugger;
        // window.ctx1.clearRect (0, 0, 341, 238);
        // window.ctx1.beginPath();
        // window.ctx1.moveTo(lower[0][0], lower[0][1]);
        // for (var i = 0; i < lower.length; i++) {
        //     window.ctx1.lineTo(lower[i][0], lower[i][1]);
        //     window.ctx1.moveTo(lower[i][0], lower[i][1]);
        // }
        // window.ctx1.stroke();
        // window.ctx1.closePath();
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

        // debugger;
        // window.ctx1.clearRect (0, 0, 341, 238);
        // window.ctx1.beginPath();
        // window.ctx1.moveTo(upper[0][0], upper[0][1]);
        // for (var i = 0; i < upper.length; i++) {
        //     window.ctx1.lineTo(upper[i][0], upper[i][1]);
        //     window.ctx1.moveTo(upper[i][0], upper[i][1]);
        // }
        // window.ctx1.stroke();
        // window.ctx1.closePath();
    }
    upper.pop();
    return upper;
}

function hull(pointset) {
    var lower, upper;

    if (pointset.length <= 1) {
        return pointset;
    }

    pointset = _sort(pointset);
    upper = _upperTangent(pointset);
    lower = _lowerTangent(pointset);
    
    return lower.concat(upper);
}
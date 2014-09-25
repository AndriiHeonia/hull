/*
 Papers:
 http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf
 http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
 http://martin-thoma.com/how-to-check-if-two-line-segments-intersect/
 http://allenchou.net/2013/07/cross-product-of-2d-vectors/
*/

function hull(pointset) {
    function sort(ps) {
        return ps.sort(function(a, b) {
            if (a[0] == b[0]) {
                return a[1] - b[1];                           
            } else {                                                    
                return a[0] - b[0];                                                           
            }                                                                                           
        });                                     
    };                      

    function cross(o, a, b) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); 
    };                          

    pointset = sort(pointset);
    if (pointset.length <= 1) {
        return pointset;
    }
    var lower = [];
    for (var l = 0; l < pointset.length; l++) {
        while (lower.length >= 2 && (cross(lower[lower.length - 2], lower[lower.length - 1], pointset[l]) <= 0)) {
            lower.pop();
        }
        lower.push(pointset[l]);
    }
    var upper = [];
    var reversed = pointset.reverse();
    for (var u = 0; u < reversed.length; u++) {
        while (upper.length >= 2 && (cross(upper[upper.length - 2], upper[upper.length - 1], reversed[u]) <= 0)) {
            upper.pop();
        }   
        upper.push(reversed[u]);
    }   
    upper.pop();
    lower.pop();
    return lower.concat(upper);
}
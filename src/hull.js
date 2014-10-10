/*
 Papers:
 http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf
 http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
 http://martin-thoma.com/how-to-check-if-two-line-segments-intersect/
*/

function _sortByX(pointset) {
    return pointset.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] - b[1];                           
        } else {                                                    
            return a[0] - b[0];                                                           
        }
    });
}

// see http://allenchou.net/2013/07/cross-product-of-2d-vectors/
function _cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); 
}

// see http://users.livejournal.com/_winnie/237714.html
// and http://habrahabr.ru/post/105882/
function _cos(o, a, b) {
    var aShifted = [a[0] - o[0], a[1] - o[1]],
        bShifted = [b[0] - o[0], b[1] - o[1]],
        sqALen = _sqLength([o, a]),
        sqBLen = _sqLength([o, b]),
        dot = aShifted[0] * bShifted[0] + aShifted[1] * bShifted[1];

    return dot / Math.sqrt(sqALen * sqBLen);
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

function _sqLength(edge) {
    return Math.pow(edge[1][0] - edge[0][0], 2) + Math.pow(edge[1][1] - edge[0][1], 2);
}

function _intersect(edge, pointset) {
    var a = {
        'first': {
            x: edge[0][0],
            y: edge[0][1]
        },
        'second': {
            x: edge[1][0],
            y: edge[1][1]                
        }
    };

    for (var i = 0; i < pointset.length - 1; i++) {
        var b = {
            'first': {
                x: pointset[i][0],
                y: pointset[i][1]
            },
            'second': {
                x: pointset[i + 1][0],
                y: pointset[i + 1][1]
            }
        };

        if (edge[0][0] === pointset[i][0] && edge[0][1] === pointset[i][1] ||
            edge[0][0] === pointset[i + 1][0] && edge[0][1] === pointset[i + 1][1]) {
            continue;
        }

        if (segments.intersect(a, b)) {
            return true;
        }
    }

    return false;
}

function _bBoxAround(edge) {
    var minX, maxX, minY, maxY;

    if (edge[0][0] < edge[1][0]) {
        minX = edge[0][0] - MAX_EDGE_LENGTH;
        maxX = edge[1][0] + MAX_EDGE_LENGTH;
    } else {
        minX = edge[1][0] - MAX_EDGE_LENGTH;
        maxX = edge[0][0] + MAX_EDGE_LENGTH;
    }

    if (edge[0][1] < edge[1][1]) {
        minY = edge[0][1] - MAX_EDGE_LENGTH;
        maxY = edge[1][1] + MAX_EDGE_LENGTH;
    } else {
        minY = edge[1][1] - MAX_EDGE_LENGTH;
        maxY = edge[0][1] + MAX_EDGE_LENGTH;
    }

    return [
        [minX, minY], // tl
        [maxX, maxY]  // br
    ];
}

function _insideBBox(point, bbox) {
    if (point[0] < bbox[0][0] ||
        point[0] > bbox[1][0] ||
        point[1] < bbox[0][1] ||
        point[1] > bbox[1][1]) { return false; }
    return true;
}

function _midPointIdx(edge, innerPoints, convex) {
    var point1Idx = null, point2Idx = null,
        angle1Cos = MAX_CONCAVE_ANGLE_COS,
        angle2Cos = MAX_CONCAVE_ANGLE_COS,
        a1Cos, a2Cos;
        bbox = _bBoxAround(edge); 

    for (var i = 0; i < innerPoints.length; i++) {
        if (innerPoints[i] === null ||
            _insideBBox(innerPoints[i], bbox) === false) {
            continue;
        }

        a1Cos = _cos(edge[0], edge[1], innerPoints[i]);
        a2Cos = _cos(edge[1], edge[0], innerPoints[i]);

        if (a1Cos > MAX_CONCAVE_ANGLE_COS && a2Cos > MAX_CONCAVE_ANGLE_COS) {            
            if (a1Cos > angle1Cos /*&& !_intersect([edge[0], innerPoints[i]], convex)*/) {
                angle1Cos = a1Cos;
                point1Idx = i;
            }
            if (a2Cos > angle2Cos /*&& !_intersect([edge[1], innerPoints[i]], convex)*/) {
                angle2Cos = a2Cos;
                point2Idx = i;
            }            
        }
    }

    return angle1Cos > angle2Cos ? point1Idx : point2Idx;
}

// TODO
/**
  1. Оптимизировать:
    1.1. splice() complexity O(N), то есть, сложность вставки midPoint-ов сейчас O(N^2 + N^2).
         innerPoints надо вместо удаления просто маркать как удаленные (FIXED).
    1.2. ф-ю рассчета угла (FIXED)
    1.3. можем ли как-то ограничить область пооиска midPoint-ов (FIXED)
    1.4. упростить метод intersect (А он нужен? FIXED)
    1.5. попробовать удалить никогда не используемые точки в середине
  2. Автоматически считать угол и дистанцию
 */
function _concave(convex, innerPoints) {
    var midPointIdx, markedInnerPoints,
        midPointInserted = false;

    for (var i = 0; i < convex.length - 1; i++) {
        if (_sqLength([convex[i], convex[i + 1]]) <= MAX_SQ_EDGE_LENGTH) { continue; }

        /*
        TODO:
        в innerPoints должны быть только те точки, которые входят в прямоугольник _bBoxAround(edge)
        Это позволит внутри _midPointIdx: а) не обходить все точки; б) убрать проверку _insideBBox
        Такой поиск можно осуществить имея kd-tree за O(log N).
        В итоге O(convex.len * innerPoints.len) проверок заменим на 
        O(convex.len * log(innerPoints.len))
        */

        midPointIdx = _midPointIdx([convex[i], convex[i + 1]], innerPoints, convex);
        if (midPointIdx !== null) {
            convex.splice(i + 1, 0, innerPoints[midPointIdx]);
            innerPoints[midPointIdx] = null;
            midPointInserted = true;
        }
    }

    if (midPointInserted) {
        return _concave(convex, innerPoints);
    }

    return convex;
}

function hull(pointset) {
    var lower,
        upper,
        convex,
        concave;

    if (pointset.length <= 1) {
        return pointset;
    }

    console.time('sortByX');
    pointset = _sortByX(pointset);
    console.timeEnd('sortByX');

    console.time('convex');
    upper = _upperTangent(pointset);
    lower = _lowerTangent(pointset);
    convex = lower.concat(upper);
    console.timeEnd('convex');
    
    console.time('innerPoints');
    var innerPoints = pointset.filter(function(pt) {
        return convex.indexOf(pt) < 0;
    });
    console.timeEnd('innerPoints');

    console.time('concave');
    concave = _concave(convex, innerPoints);
    console.timeEnd('concave');

    return concave;
}

var MAX_CONCAVE_ANGLE_COS = Math.cos(90 / (180 / Math.PI)); // angle = 90 deg
var MAX_EDGE_LENGTH = 10;
var MAX_SQ_EDGE_LENGTH = Math.pow(MAX_EDGE_LENGTH, 2);
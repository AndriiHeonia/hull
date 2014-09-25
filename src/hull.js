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
 http://allenchou.net/2013/07/cross-product-of-2d-vectors/
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

            var cols = ['red', 'red', 'red', 'blue', 'blue', 'blue', 'green', 'green', 'green', 'orange', 'orange', 'orange'];
            window.ctx.fillStyle = cols[i];
            window.ctx.beginPath();
            window.ctx.arc(pixels[i-2][0], pixels[i-2][1], 2, 0, 2 * Math.PI, true);
            window.ctx.fill();
            window.ctx.closePath();
            window.ctx.beginPath();
            window.ctx.arc(pixels[i-1][0], pixels[i-1][1], 2, 0, 2 * Math.PI, true);
            window.ctx.fill();
            window.ctx.closePath();
            window.ctx.beginPath();
            window.ctx.arc(pixels[i][0], pixels[i][1], 2, 0, 2 * Math.PI, true);
            window.ctx.fill();
            window.ctx.closePath();
        }
    }

    return trios;
}

function _crossProduct(origin, vector1, vector2) {
    var v1 = [
            vector1[0] - origin[0],
            vector1[1] - origin[1]
        ],
        v2 = [
            vector2[0] - origin[0],
            vector2[1] - origin[1]
        ];
    return v1[0] * v2[1] - v1[1] * v2[0];
}

function _getUpperTangent(subset1, subset2) {
    var subs1RightPx = subset1[subset1.length - 1],
        subs2LeftPx = subset2[0],
        tangent = [subs1RightPx, subs2LeftPx],
        skippedTangents = [];

    function walkCcwOnSubset1() {
        var beforeChanges = tangent[0].slice(0);
        for (var i = subset1.length - 1; i >= 0 ; i--) {

            // window.ctx1.beginPath();
            // window.ctx1.strokeStyle = "red";
            // window.ctx1.moveTo(tangent[1][0], tangent[1][1]);
            // window.ctx1.lineTo(tangent[0][0], tangent[0][1]);
            // window.ctx1.stroke();
            // window.ctx1.closePath();
            // window.ctx1.beginPath();
            // window.ctx1.strokeStyle = "green";
            // window.ctx1.moveTo(tangent[1][0], tangent[1][1]);
            // window.ctx1.lineTo(subset1[i][0], subset1[i][1]);
            // window.ctx1.stroke();
            // window.ctx1.closePath();
            // window.ctx1.clearRect (0, 0, 341, 238);

            if (_crossProduct(tangent[1], subs1RightPx, subset1[i]) < 0) { continue; }
            if (subset1[i-1] === undefined || subset1[i-1][0] !== subset1[i][0]) {
                if (_crossProduct(tangent[1], tangent[0], subset1[i]) < 0) { break; }
            }
            tangent[0] = subset1[i];
        }
        return beforeChanges[0] !== tangent[0][0] || beforeChanges[1] !== tangent[0][1];
    }

    function walkCwOnSubset2() {
        var beforeChanges = tangent[1].slice(0);
        for (var i = 0; i < subset2.length; i++) {

            // window.ctx1.beginPath();
            // window.ctx1.strokeStyle = "red";
            // window.ctx1.moveTo(tangent[0][0], tangent[0][1]);
            // window.ctx1.lineTo(tangent[1][0], tangent[1][1]);
            // window.ctx1.stroke();
            // window.ctx1.closePath();
            // window.ctx1.beginPath();
            // window.ctx1.strokeStyle = "green";
            // window.ctx1.moveTo(tangent[0][0], tangent[0][1]);
            // window.ctx1.lineTo(subset2[i][0], subset2[i][1]);
            // window.ctx1.stroke();
            // window.ctx1.closePath();
            // window.ctx1.clearRect (0, 0, 341, 238);

            if (_crossProduct(tangent[0], subs2LeftPx, subset2[i]) > 0) { continue; }
            if (_crossProduct(tangent[0], tangent[1], subset2[i]) > 0) { break; }
            tangent[1] = subset2[i];
        }
        return beforeChanges[0] !== tangent[1][0] || beforeChanges[1] !== tangent[1][1];
    }

    var tangentChangedOnCcw = false, tangentChangedOnCw = false;
    do {
        tangentChangedOnCcw = walkCcwOnSubset1();
        tangentChangedOnCw = walkCwOnSubset2();

        window.ctx.beginPath();
        window.ctx.moveTo(tangent[0][0], tangent[0][1]);
        window.ctx.lineTo(tangent[1][0], tangent[1][1]);
        window.ctx.stroke();
        window.ctx.closePath();

    } while (tangentChangedOnCcw || tangentChangedOnCw);

    return tangent;
}

function _getLowerTangent(subset1, subset2) {
    var subs1RightPx = subset1[subset1.length - 1],
        subs2LeftPx = subset2[0],
        tangent = [subs1RightPx, subs2LeftPx];

    function walkCwOnSubset1() {
        var beforeChanges = tangent[0].slice(0);
        for (var i = subset1.length - 1; i >= 0 ; i--) {            
            // window.ctx1.beginPath();
            // window.ctx1.strokeStyle = "red";
            // window.ctx1.moveTo(tangent[1][0], tangent[1][1]);
            // window.ctx1.lineTo(tangent[0][0], tangent[0][1]);
            // window.ctx1.stroke();
            // window.ctx1.closePath();
            // window.ctx1.beginPath();
            // window.ctx1.strokeStyle = "green";
            // window.ctx1.moveTo(tangent[1][0], tangent[1][1]);
            // window.ctx1.lineTo(subset1[i][0], subset1[i][1]);
            // window.ctx1.stroke();
            // window.ctx1.closePath();
            // window.ctx1.clearRect (0, 0, 341, 238);

            if (_crossProduct(tangent[1], subs1RightPx, subset1[i]) > 0) { continue; }
            if (_crossProduct(tangent[1], tangent[0], subset1[i]) > 0) { break; }
            tangent[0] = subset1[i];
        }
        return beforeChanges[0] !== tangent[0][0] || beforeChanges[1] !== tangent[0][1];
    }

    function walkCcwOnSubset2() {
        var beforeChanges = tangent[1].slice(0);
        for (var i = 0; i < subset2.length; i++) {
            // window.ctx1.beginPath();
            // window.ctx1.strokeStyle = "red";
            // window.ctx1.moveTo(tangent[0][0], tangent[0][1]);
            // window.ctx1.lineTo(tangent[1][0], tangent[1][1]);
            // window.ctx1.stroke();
            // window.ctx1.closePath();
            // window.ctx1.beginPath();
            // window.ctx1.strokeStyle = "green";
            // window.ctx1.moveTo(tangent[0][0], tangent[0][1]);
            // window.ctx1.lineTo(subset2[i][0], subset2[i][1]);
            // window.ctx1.stroke();
            // window.ctx1.closePath();
            // window.ctx1.clearRect (0, 0, 341, 238);

            if (_crossProduct(tangent[0], subs2LeftPx, subset2[i]) < 0) { continue; }
            if (_crossProduct(tangent[0], tangent[1], subset2[i]) < 0) { break; }
            tangent[1] = subset2[i];
        }
        return beforeChanges[0] !== tangent[1][0] || beforeChanges[1] !== tangent[1][1];
    }

    var tangentChangedOnCcw = false, tangentChangedOnCw = false;
    do {
        tangentChangedOnCw = walkCwOnSubset1();
        tangentChangedOnCcw = walkCcwOnSubset2();

        window.ctx.beginPath();
        window.ctx.moveTo(tangent[0][0], tangent[0][1]);
        window.ctx.lineTo(tangent[1][0], tangent[1][1]);
        window.ctx.stroke();
        window.ctx.closePath();
    } while (tangentChangedOnCcw || tangentChangedOnCw);

    return tangent;
}

function _reduce(subsets) {
    var upperPxsObj = {},
        lowerPxsObj = {},
        upperPxsArr = [],
        lowerPxsArr = [];

    subsets.reduce(function(subset1, subset2) {
        var upperTangent = _getUpperTangent(subset1, subset2),
            lowerTangent = _getLowerTangent(subset1, subset2);

        upperPxsObj[upperTangent[0].join('-')] = upperTangent[1];
        lowerPxsObj[lowerTangent[0].join('-')] = lowerTangent[1];

        return _sort([upperTangent[0], upperTangent[1], lowerTangent[1], lowerTangent[0]]);
    });

    for (var key in upperPxsObj) {
        upperPxsArr.push(key.split('-'), upperPxsObj[key]);
    }

    for (var key in lowerPxsObj) {
        lowerPxsArr.push(key.split('-'), lowerPxsObj[key]);
    }

    return upperPxsArr.concat(lowerPxsArr.reverse());
}

function hull(pixels, ctx, ctx1) {
    window.ctx = ctx;
    window.ctx1 = ctx1;
    var pxs = _sort(pixels.slice(0));
    return _reduce(_map(pxs));
}

// module.exports = hull;
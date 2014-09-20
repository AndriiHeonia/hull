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
        }
    }
    return trios;
}

function _getUpperTangent(subset1, subset2) {
    var subs1RightPx = subset1[subset1.length - 1],
        subs2LeftPx = subset2[0],
        tangent = [subs1RightPx, subs2LeftPx];

    // walk top left (ccw) on subset1
    for (var i = subset1.length - 1; i >= 0 ; i--) {
        if (subset1[i][1] < subs1RightPx[1]) {
            if (subset1[i][1] > tangent[0][1]) { break; }
            tangent[0] = subset1[i];
        }
    }

    // walk top right (cw) on subset2
    for (var i = 0; i < subset2.length; i++) {
        if (subset2[i][1] < subs2LeftPx[1]) {
            if (subset2[i][1] > tangent[1][1]) { break; }
            tangent[1] = subset2[i];
        }
    }

    return tangent;
}

function _getLowerTangent(subset1, subset2) {
    var subs1RightPx = subset1[subset1.length - 1],
        subs2LeftPx = subset2[0],
        tangent = [subs1RightPx, subs2LeftPx];

    // walk bottom left (cw) on subset1
    for (var i = subset1.length - 1; i >= 0 ; i--) {
        if (subset1[i][1] > subs1RightPx[1]) {
            if (subset1[i][1] < tangent[0][1]) { break; }
            tangent[0] = subset1[i];
        }
    }

    // walk bottom right (ccw) on subset2
    for (var i = 0; i < subset2.length; i++) {
        if (subset2[i][1] > subs2LeftPx[1]) {
            if (subset2[i][1] < tangent[1][1]) { break; }
            tangent[1] = subset2[i];
        }
    }

    return tangent;
}

function _reduce(subsets, ctx) {
    var upperPxsObj = {},
        lowerPxsObj = {},
        upperPxsArr = [],
        lowerPxsArr = [],
        len = subsets.length;

    subsets.reduce(function(subset1, subset2) {
        var upperTangent = _getUpperTangent(subset1, subset2),
            lowerTangent = _getLowerTangent(subset1, subset2);

        // // draw upperTangent
        // ctx.beginPath();
        // ctx.moveTo(upperTangent[0][0], upperTangent[0][1]);
        // ctx.lineTo(upperTangent[1][0], upperTangent[1][1]);
        // ctx.stroke();
        // ctx.closePath();
        // // draw lowerTangent
        // ctx.beginPath();
        // ctx.moveTo(lowerTangent[0][0], lowerTangent[0][1]);
        // ctx.lineTo(lowerTangent[1][0], lowerTangent[1][1]);
        // ctx.stroke();
        // ctx.closePath();

        upperPxsObj[upperTangent[0].join('-')] = upperTangent[1];
        lowerPxsObj[lowerTangent[0].join('-')] = lowerTangent[1];

        return [upperTangent[0], upperTangent[1], lowerTangent[1], lowerTangent[0]];
    });

    for (var key in upperPxsObj) {
        upperPxsArr.push(key.split('-'), upperPxsObj[key]);
    }
    for (var key in lowerPxsObj) {
        lowerPxsArr.push(key.split('-'), lowerPxsObj[key]);
    }

    return upperPxsArr.concat(lowerPxsArr.reverse());
}

function hull(pixels, ctx) {
    var pxs = _sort(pixels.slice(0));
    return _reduce(_map(pxs), ctx);
}

// module.exports = hull;
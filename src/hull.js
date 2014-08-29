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

function _isPointOnPolyline(px, polyline) {
    for (var i = 0; i < polyline.length-1; i++) {
        var seg = {
                first: {
                    x: polyline[i].x,
                    y: polyline[i].y
                },
                second: {
                    x: polyline[i+1].x,
                    y: polyline[i+1].y
                }
            };

        if (segments.isPointOnLine(seg, px)) {            
            return true;
        }
    }
    return false;
}

function _intersects(line, polyline) {
    _drawPolyAndLine(polyline, line);
    var seg1 = {
            first: {
                x: line[0].x,
                y: line[0].y
            },
            second: {
                x: line[1].x,
                y: line[1].y
            }
        };

    for (var i = 0; i < polyline.length-1; i++) {
        var seg2 = {
                first: {
                    x: polyline[i].x,
                    y: polyline[i].y
                },
                second: {
                    x: polyline[i+1].x,
                    y: polyline[i+1].y
                }
            };

        if (segments.intersect(seg1, seg2)) {
            var intersectPx = segments.getIntersection(seg1, seg2).first;
            intersectPx.x = Math.round(intersectPx.x);
            intersectPx.y = Math.round(intersectPx.y);
            if ((intersectPx.x === seg1.first.x && intersectPx.y === seg1.first.y) ||
                (intersectPx.x === seg1.second.x && intersectPx.y === seg1.second.y)) {
                continue;
            } else {
                return true;
            }
        }
    }

    return false;
}

function _allPixelsInPolygon(pixels, polygon) {
    for (var i = 0; i < pixels.length; i++) {
        if (!pxInPolygon(pixels[i], polygon)) {
            return false;
        }
    }
    return true;
}

function _getNeighbors(vertice, diagram, visited, k) {
    var nPxs = [],
        halfedge,
        lSite,
        rSite,
        k = k || 3,
        queue = [],
        inQueue = {},
        voronoiId;

    queue.push(vertice.voronoiId);
    inQueue[vertice.voronoiId] = true;

    var fCells = diagram.cells.filter(function(cell) {
        return visited[cell.site.voronoiId] !== true;
    });

    nPxs = fCells.map(function(cell) {
        return cell.site;
    });

    // while (nPxs.length < k) {
    //     voronoiId = queue.shift();
    //     if (voronoiId === undefined) {
    //         break;
    //     }

    //     for (var i = 0; i < diagram.cells[voronoiId].halfedges.length; i++) {
    //         halfedge = diagram.cells[voronoiId].halfedges[i];
    //         lSite = halfedge.edge.lSite;
    //         rSite = halfedge.edge.rSite;

    //         if (lSite && lSite.voronoiId !== voronoiId) {
    //             if (inQueue[lSite.voronoiId] !== true) {
    //                 inQueue[lSite.voronoiId] = true;
    //                 queue.push(lSite.voronoiId);
    //             }
    //             if (visited[lSite.voronoiId] !== true) {
    //                 nPxs.push(lSite);
    //             }
    //         }
    //         if (rSite && rSite.voronoiId !== voronoiId) {
    //             if (inQueue[rSite.voronoiId] !== true) {
    //                 queue.push(rSite.voronoiId);
    //                 inQueue[rSite.voronoiId] = true;
    //             }
    //             if (visited[rSite.voronoiId] !== true) {
    //                 nPxs.push(rSite);
    //             }
    //         }
    //     }
    // }

    nPxs = nPxs.sort(function(px1, px2) {
        return _getDistance(vertice, px1) - _getDistance(vertice, px2);
    }).slice(0, k);

    // for (var i = 0; i < nPxs.length; i++) {
    //     console.log(_getDistance(vertice, nPxs[i]));
    // }
    // console.log('---');

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
        ctx2.clearRect (0,0,400,400);
        ctx2.fillStyle="yellow";
        currentNPxs.forEach(function(px) {
            ctx2.beginPath();
            ctx2.arc(px.x, px.y, 2, 0, 2 * Math.PI, true);
            ctx2.fill();
            ctx2.closePath();
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

function _drawPolyAndLine(polyline, line) {
    // ctx.beginPath();
    // ctx.strokeStyle = "gray";
    // polyline.forEach(function(px) {
    //     ctx.lineTo(px.x, px.y);
    //     ctx.moveTo(px.x, px.y);
    //     ctx.stroke();
    // });
    // ctx.closePath();

    ctx1.beginPath();
    ctx1.strokeStyle = "orange";
    ctx1.moveTo(line[0].x, line[0].y);
    ctx1.lineTo(line[1].x, line[1].y);
    ctx1.stroke();
    ctx1.closePath();
}

function _drawPolygon(polygon) {
    ctx1.clearRect (0,0,400,400);
    ctx1.beginPath();
    ctx1.strokeStyle = "gray";
    polygon.forEach(function(px) {
        ctx1.lineTo(px.x, px.y);
        ctx1.moveTo(px.x, px.y);
        ctx1.stroke();
    });
    ctx1.closePath();
}

window.hull = function(pixels, k) {
    var voronoi = new Voronoi(),
        diagram = voronoi.compute(pixels, _getBbox(pixels)),
        startPx = currentPx = _getBottomPx(diagram),
        visited = {};
        visited[currentPx.voronoiId] = true;
        var k = k || 3,
        currentNPxs = _getNeighbors(currentPx, diagram, visited),
        mostRightNPx = _getMostRightPx(currentPx, currentNPxs),
        result = [startPx];

    _drawNet(diagram);

    // visited[currentPx.voronoiId] = true;
    while ((mostRightNPx.voronoiId !== startPx.voronoiId) /*|| !_allPixelsInPolygon(pixels, result)*/) {
        // debugger;

        // console.log(!_allPixelsInPolygon(pixels, result));

        currentPx = mostRightNPx;
        _drawPoints(currentPx, undefined, undefined);
        visited[currentPx.voronoiId] = true;
        
        function _getAndFilterNPxs(k) {
            var res = _getNeighbors(currentPx, diagram, visited, k);
            res = res.filter(function(nPx) {
                var line = [result[result.length-1], nPx],
                    polyline = result.slice(0);

                var p = polyline.slice(0);
                // p.push(startPx);
                _drawPolygon(p);
                // TODO: нельзя брать точку которая лежит на сегменте!
                return !_isPointOnPolyline(nPx, polyline) && !_intersects(line, polyline) /*&& !pxInPolygon(nPx, p)*/ && nPx.voronoiId !== startPx.voronoiId;
            });
            return res;
        }

        currentNPxs = _getAndFilterNPxs(k);
        if (currentNPxs.length<k) {
            var newK = k;
            while (currentNPxs.length<k && newK<pixels.length) {
                newK++;
                currentNPxs = _getAndFilterNPxs(newK);
            }
        }

        _drawPoints(undefined, currentNPxs, undefined);

        if (!currentNPxs.length) { console.log('Last: ', currentPx); return result; }

        mostRightNPx = _getMostRightPx(currentPx, currentNPxs);

        _drawPoints(undefined, undefined, mostRightNPx);


        result.push(mostRightNPx);

        if (result.length > 1 && visited[startPx.voronoiId] === true) {
            delete visited[startPx.voronoiId];
        }
    }

    return result;
}

})();
Hull.js - JavaScript library that builds concave hull by set of points.

[![Build Status](https://travis-ci.org/AndriiHeonia/hull.svg?branch=master)](https://travis-ci.org/AndriiHeonia/hull)

## Examples

See live examples <a target="_blank" href="http://andriiheonia.github.io/hull/">here</a>.

## Usage

	var points = [ [236, 126], [234, 115], [238, 109], [247, 102], ... ];
	hull(points, 50); // returns points of the hull (in clockwise order)

## Params
* 1st param - array of coordinates in format: `[[x1, y1], [x2, y2], ..., [xn, yn]]`;
* 2nd param - concavity. `1` - thin shape. `Infinity` - convex hull. By default `20`;
* 3rd param - points format. For example: `['.lng', '.lat']` if you have `{lng: x, lat: y}` points. By default you can use `[x, y]` points.

## How it works

Let's see step by step what happens when you call `hull()` function:

<ol>
    <li>
        <div>Hull.js takes your source points of the shape:</div>
        <div><img src="https://raw.githubusercontent.com/AndriiHeonia/hull/master/readme-imgs/0.png" /></div>
    </li>
    <li>
        <div>Builds convex hull:</div>
        <div><img src="https://raw.githubusercontent.com/AndriiHeonia/hull/master/readme-imgs/1.png" /></div>
    </li>
    <li>
        <div>After that, the edges flex inward (according to the `concavity` param). For example:</div>
        <div>
            <img src="https://raw.githubusercontent.com/AndriiHeonia/hull/master/readme-imgs/2_1.png" />
            `concavity = 80`<br/>
            <img src="https://raw.githubusercontent.com/AndriiHeonia/hull/master/readme-imgs/2_2.png" />
            `concavity = 40`<br/>
            <img src="https://raw.githubusercontent.com/AndriiHeonia/hull/master/readme-imgs/2_3.png" />
            `concavity = 20`
        </div>
    </li>
</ol>

## Development
	npm install             # install dependencies
	npm test	            # build dist file and run tests
	npm run-script watch    # watch ./src dir and rebuild dist file

## Contribute

If you want to get involved with Hull.js development, just use <a href="https://guides.github.com/introduction/flow/index.html" target="_blank">github flow</a> and feel free to contribute!

## To-do

* think about parallelisation (on GPU or CPU);
* think about holes;
* think about automatic `concavity` adjustment based on density.

## Related papers

* <a target="_blank" href="http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf">Implementation of a fast and efficient concave hull algorithm</a>;
* <a target="_blank" href="http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf">Computational Geometry: Convex Hulls</a>;
* <a target="_blank" href="https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain">Andrew's monotone chain convex hull algorithm</a>;
* <a target="_blank" href="http://bryceboe.com/2006/10/23/line-segment-intersection-algorithm/">Line Segment Intersection Algorithm</a>;
* <a target="_blank" href="http://allenchou.net/2013/07/cross-product-of-2d-vectors/">Game Math: "Cross Product" of 2D Vectors</a>;
* <a target="_blank" href="http://users.livejournal.com/_winnie/237714.html">Угол между двумя векторами</a>;
* <a target="_blank" href="http://habrahabr.ru/post/105882/">Когда не нужна тригонометрия</a>.

## Changelog

### 0.2.10 — 04.09.2016
Fixed missing "var" declaration
### 0.2.9 — 28.07.2016
Fixed modification of the initial array, added filtration of the duplicates
### 0.2.8 — 01.04.2016
Added edgeSkipList to increase performance of the highly accurate shapes (with the small `concavity` number) + refactoring.
### 0.2.7 — 01.05.2015
Fixed bower.json
### 0.2.6 — 01.05.2015
Fixed bower.json
### 0.2.5 — 01.05.2015
Bower support
### 0.2.4 — 23.03.2015
Minor fixes (copyrights)
### 0.2.3 — 04.02.2015
Minor fixes (readme, package.json)
### 0.2.2 — 04.02.2015
Configurable point formats, now you can use points like `{x: 10, y: 10}` and `{lat: 52, lng: 82}`.
### 0.2.1 — 21.10.2014
Some minor updates (doc, package.json, etc.).
### 0.2.0 — 20.10.2014
Second version with better performance inspired by <a href="http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf" target="_blank">this</a> article.
### 0.1.0 — 06.09.2014
First version based on Delaunay triangulation.

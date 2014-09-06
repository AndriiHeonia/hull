Hull.js - JavaScript library that builds concave hulls by set of points.

## Usage

	var pixels = [ [236, 126], [234, 115], [238, 109], [247, 102], ... ];
	hull(pixels, 50); // returns vertex indices of the hull (in clockwise order)

## Params
* 1st param - array of coordinates in format: [[x1, y1], [x2, y2], ..., [xn, yn]];
* 2nd param - tolerance. The value of the cutoff boundaries. Lesser tolerance - thinning shape. Large tolerance - convex hull.

## How it works

Let's see step by step what happens when you call `hull()` function:

0. Source point set of the shape:
<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/0.png" />
1. Hull.js triangulates your shape via <a target="_blank" href="https://github.com/ironwallaby/delaunay">Delaunay triangulation library</a>:
<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/1.png" />
2. After triangulation it cuts edges according to your `tolerance` param:
<img src="2_1.png" />
Tolerance = 50
<img src="2_2.png" />
Tolerance = 100
<img src="2_3.png" />
Tolerance = 150
3. After that it finds boundary edges:
<img src="3.png" />
4. And finaly it sorts boundary edges and returns hull of the shape:
<img src="4.png" />

## Examples

You can see more examples <a href="https://github.com/AndreyGeonya/hull/tree/master/examples">here</a>. Just clone this repository and run them in your browser.

## Development
	npm install # install dependencies
	npm test	# build dist file and run tests

## Changelog

* 0.0.1 — 06.09.2014
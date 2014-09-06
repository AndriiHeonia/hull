Hull.js - JavaScript library that builds concave hulls by set of points.

## Usage

	var pixels = [ [236, 126], [234, 115], [238, 109], [247, 102], ... ];
	hull(pixels, 50); // returns vertex indices of the hull (in clockwise order)

## Params
* 1st param - array of coordinates in format: [[x1, y1], [x2, y2], ..., [xn, yn]];
* 2nd param - tolerance. The value of the cutoff boundaries. Lesser tolerance - thinning shape. Large tolerance - convex hull.

## How it works

Let's see step by step what happens when you call `hull()` function:

<ol>

<li>Hull.js takes your source points of the shape:

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/0.png" /></li>

<li>Triangulates your shape via <a target="_blank" href="https://github.com/ironwallaby/delaunay">Delaunay triangulation library</a>:

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/1.png" />

<li>After triangulation it cuts edges according to your `tolerance` param. For example:

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/2_1.png" />
`tolerance = 80`

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/2_2.png" />
`tolerance = 40`

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/2_3.png" />
`tolerance = 20`</li>

<li>After that it finds boundary edges:

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/3.png" /></li>

<li>And finaly it sorts boundary edges and returns hull of the shape:

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/4.png" /></li>

## Examples

You can see more examples <a href="https://github.com/AndreyGeonya/hull/tree/master/examples">here</a>. Just clone this repository and run them in your browser.

## Development
	npm install # install dependencies
	npm test	# build dist file and run tests

## Changelog

* 0.0.1 — 06.09.2014
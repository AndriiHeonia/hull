Hull.js - JavaScript library that builds <a href="http://ubicomp.algoritmi.uminho.pt/local/concavehull.html" target="_blank">concave hull</a> by set of points.

## Usage

	var points = [ [236, 126], [234, 115], [238, 109], [247, 102], ... ];
	hull(points, 50); // returns vertex indices of the hull (in clockwise order)

## Params
* 1st param - array of coordinates in format: [[x1, y1], [x2, y2], ..., [xn, yn]];
* 2nd param - concavity. 1 - thin shape. Infinity - convex hull.

## How it works

Let's see step by step what happens when you call `hull()` function:

<ol>

<li>Hull.js takes your source points of the shape:

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/0.png" /></li>

<li>Builds convex hull:

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/1.png" />

<li>After that, the edges flex inward (according to `concavity` param). For example:

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/2_1.png" />
`concavity = 80`

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/2_2.png" />
`concavity = 40`

<img src="https://raw.githubusercontent.com/AndreyGeonya/hull/master/readme-imgs/2_3.png" />
`concavity = 20`</li>

## Examples

TODO

## Development
	npm install # install dependencies
	npm test	# build dist file and run tests

## Contribute

If you want to get involved with Hull.js development, just use <a href="https://guides.github.com/introduction/flow/index.html" target="_blank">github flow</a> and feel free to contribute!

## Changelog

* 0.2.0 — 14.10.2014
Second version inspired by <a href="http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf" target="_blank">this</a> article.
* 0.1.0 — 06.09.2014
First version based on Delaunay triangulation.
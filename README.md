Hull.js - JavaScript library that builds <a href="http://ubicomp.algoritmi.uminho.pt/local/concavehull.html" target="_blank">concave hull</a> by set of points.

## Usage

	var pixels = [ [236, 126], [234, 115], [238, 109], [247, 102], ... ];
	hull(pixels, 50); // returns vertex indices of the hull (in clockwise order)

## Params
* 1st param - array of coordinates in format: [[x1, y1], [x2, y2], ..., [xn, yn]];
* 2nd param - tolerance. The value of the cutoff boundaries. Lesser tolerance - thinning shape. Too large tolerance - convex hull.

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

## Contribute

If you want to get involved with Hull.js development, just use <a href="https://guides.github.com/introduction/flow/index.html" target="_blank">github flow</a> and feel free to contribute!

## TODO

* implement algorithm from <a href="http://www.it.uu.se/edu/course/homepage/projektTDB/ht13/project10/Project-10-report.pdf" target="_blank">this</a> paper <a href="https://github.com/AndreyGeonya/hull/tree/speedup">speedup branch</a> and test it. It should be faster than current algo;
* write more real world examples (may be as an article);
* think about parallelisation of the calcs (on GPU or CPU).

## Changelog

* 0.0.1 — 06.09.2014
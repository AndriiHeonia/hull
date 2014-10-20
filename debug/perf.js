var horse13k = require('./data/horse13k.js'),
    horse26k = require('./data/horse26k.js'),
    horse52k = require('./data/horse52k.js'),
    horse131k = require('./data/horse131k.js'),
    owl15k = require('./data/owl15k.js'),
    owl30k = require('./data/owl30k.js'),
    owl58k = require('./data/owl58k.js'),
    owl102k = require('./data/owl102k.js');

var hull = require('../src/hull');

console.time('hull(horse13k, 20)');
hull(horse13k, 20);
console.timeEnd('hull(horse13k, 20)');

console.time('hull(horse26k, 20)');
hull(horse26k, 20);
console.timeEnd('hull(horse26k, 20)');

console.time('hull(horse52k, 20)');
hull(horse52k, 20);
console.timeEnd('hull(horse52k, 20)');

console.time('hull(horse131k, 20)');
hull(horse131k, 20);
console.timeEnd('hull(horse131k, 20)');

console.log('\n');

console.time('hull(owl15k, 20)');
hull(owl15k, 20);
console.timeEnd('hull(owl15k, 20)');

console.time('hull(owl30k, 20)');
hull(owl30k, 20);
console.timeEnd('hull(owl30k, 20)');

console.time('hull(owl58k, 20)');
hull(owl58k, 20);
console.timeEnd('hull(owl58k, 20)');

console.time('hull(owl102k, 20)');
hull(owl102k, 20);
console.timeEnd('hull(owl102k, 20)');


// master:
// hull(horse13k, 20): 1613ms
// hull(horse26k, 20): 2318ms
// hull(horse52k, 20): 5597ms
// hull(horse131k, 20): 19700ms

// hull(owl15k, 20): 518ms
// hull(owl30k, 20): 829ms
// hull(owl58k, 20): 2034ms
// hull(owl102k, 20): 4320ms

// ------------------------------

// speedup:
// hull(horse13k, 20): 188ms
// hull(horse26k, 20): 189ms
// hull(horse52k, 20): 306ms
// hull(horse131k, 20): 653ms

// hull(owl15k, 20): 43ms
// hull(owl30k, 20): 112ms
// hull(owl58k, 20): 153ms
// hull(owl102k, 20): 219ms

// ------------------------------

// Horse: 8.6x, 12.3x, 18.3x, 30.2x
// Owl: 12x, 7.4x, 13.3x, 19.7x

// Hull.js 0.2. Now it's ~20x faster (on 100K points) than previous triangulation based version.
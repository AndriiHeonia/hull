var horse13k = require('./data/horse13k.js'),
    horse26k = require('./data/horse26k.js'),
    horse52k = require('./data/horse52k.js'),
    horse131k = require('./data/horse131k.js'),
    owl15k = require('./data/owl15k.js'),
    owl30k = require('./data/owl30k.js'),
    owl58k = require('./data/owl58k.js'),
    owl102k = require('./data/owl102k.js'),
    geoNorvay600k = require('./data/geoNorvay600k.js');

var hull = require('../src/hull');

// concavity = 20

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

console.log('\n');

// concavity = 10

console.time('hull(horse13k, 10)');
hull(horse13k, 10);
console.timeEnd('hull(horse13k, 10)');

console.time('hull(horse26k, 10)');
hull(horse26k, 10);
console.timeEnd('hull(horse26k, 10)');

console.time('hull(horse52k, 10)');
hull(horse52k, 10);
console.timeEnd('hull(horse52k, 10)');

console.time('hull(horse131k, 10)');
hull(horse131k, 10);
console.timeEnd('hull(horse131k, 10)');

console.log('\n');

console.time('hull(owl15k, 10)');
hull(owl15k, 10);
console.timeEnd('hull(owl15k, 10)');

console.time('hull(owl30k, 10)');
hull(owl30k, 10);
console.timeEnd('hull(owl30k, 10)');

console.time('hull(owl58k, 10)');
hull(owl58k, 10);
console.timeEnd('hull(owl58k, 10)');

console.time('hull(owl102k, 10)');
hull(owl102k, 10);
console.timeEnd('hull(owl102k, 10)');

console.log('\n');

// geoNorvay600k, concavity = 0.5

console.time('hull(geoNorvay600k, 0.5)');
hull(geoNorvay600k, 0.5);
console.timeEnd('hull(geoNorvay600k, 0.5)');


// version 0.1.0:

// hull(horse13k, 20): 1613ms
// hull(horse26k, 20): 2318ms
// hull(horse52k, 20): 5597ms
// hull(horse131k, 20): 19700ms

// hull(owl15k, 20): 518ms
// hull(owl30k, 20): 829ms
// hull(owl58k, 20): 2034ms
// hull(owl102k, 20): 4320ms

// ------------------------------

// version 0.2.0:

// hull(horse13k, 20): 187ms
// hull(horse26k, 20): 191ms
// hull(horse52k, 20): 305ms
// hull(horse131k, 20): 657ms
//
// hull(owl15k, 20): 39ms
// hull(owl30k, 20): 68ms
// hull(owl58k, 20): 120ms
// hull(owl102k, 20): 201ms
//
// hull(horse13k, 10): 90634ms
// hull(horse26k, 10): 22178ms
// hull(horse52k, 10): 560ms
// hull(horse131k, 10): 1077ms
//
// hull(owl15k, 10): 61973ms
// hull(owl30k, 10): 7250ms
// hull(owl58k, 10): 181ms
// hull(owl102k, 10): 315ms

// Horse: 8.6x, 12.3x, 18.3x, 30.2x
// Owl: 12x, 7.4x, 13.3x, 19.7x
// Hull.js 0.2. Now it's ~20x faster (on 100K points) than previous triangulation based version.

// ------------------------------

// version 0.2.8:

// hull(horse13k, 20): 234ms
// hull(horse26k, 20): 237ms
// hull(horse52k, 20): 329ms
// hull(horse131k, 20): 953ms

// hull(owl15k, 20): 48ms
// hull(owl30k, 20): 66ms
// hull(owl58k, 20): 120ms
// hull(owl102k, 20): 209ms

// hull(horse13k, 10): 1176ms
// hull(horse26k, 10): 690ms
// hull(horse52k, 10): 899ms
// hull(horse131k, 10): 1341ms

// hull(owl15k, 10): 448ms
// hull(owl30k, 10): 228ms
// hull(owl58k, 10): 211ms
// hull(owl102k, 10): 309ms

// hull(geoNorvay600k, 0.5): 116772ms

// ------------------------------

// version 0.2.9:

// hull(horse13k, 20): 233ms
// hull(horse26k, 20): 240ms
// hull(horse52k, 20): 328ms
// hull(horse131k, 20): 917ms

// hull(owl15k, 20): 50ms
// hull(owl30k, 20): 69ms
// hull(owl58k, 20): 128ms
// hull(owl102k, 20): 284ms

// hull(horse13k, 10): 1160ms
// hull(horse26k, 10): 675ms
// hull(horse52k, 10): 902ms
// hull(horse131k, 10): 1215ms

// hull(owl15k, 10): 393ms
// hull(owl30k, 10): 204ms
// hull(owl58k, 10): 194ms
// hull(owl102k, 10): 279ms

// hull(geoNorvay600k, 0.5): 116033ms
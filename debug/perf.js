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
var assert = require("assert"),
    intersect = require('../src/intersect.js');

module.exports = function() {
    it('should return false for the parallel segments', function() {
        var seg1 = [[0, 0], [0, 10]],
            seg2 = [[10, 0], [10, 10]];
        assert(!intersect(seg1, seg2));
    });

    it('should return false for collinear segments', function() {
        var seg1 = [[0, 0], [0, 10]],
            seg2 = [[0, 11], [0, 20]];
        assert(!intersect(seg1, seg2));
    });

    it('should return false for intersecting lines but nonintersecting segments', function() {
        var seg1 = [[0, 0], [0, 10]],
            seg2 = [[-10, 11], [10, 11]];
        assert(!intersect(seg1, seg2));
    });

    it('should return true for intersecting segments', function() {
        var seg1 = [[0, 0], [0, 10]],
            seg2 = [[-10, 5], [10, 5]];
        assert(intersect(seg1, seg2));
    });

    it('should return true for touching segments', function() {
        var seg1 = [[0, 0], [0, 10]],
            seg2 = [[-10, 10], [10, 10]];
        assert(intersect(seg1, seg2));
    });
}
/**
 * Builds concave hull by the set of points.
 *
 * @param pointset - An array of coordinates in format: `[[x1, y1], [x2, y2], ..., [xn, yn]]`.
 * @param concavity - 1 - thin shape. Infinity - convex hull. By default 20.
 * @param format - Points format, for example: `['.lng', '.lat']` if you have `{lng: x, lat: y}` points. By default you can use `[x, y]` points.
 *
 * @returns An array of coordinates in the same format as the given `pointset`.
 */
declare function hull(pointset: number[][] | object[], concavity?: number, format?: string[]): number[][] | object[];

export = hull;

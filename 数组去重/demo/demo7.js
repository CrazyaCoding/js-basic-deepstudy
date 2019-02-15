/**
 * es6
 */
Array.prototype.unique1 = function() {
	return Array.from(new Set(this));
};

Array.prototype.unique2 = function() {
	return [...new Set(this)];
};

Array.prototype.unique3 = function() {
	const seen = new Map();
	return this.filter(a => !seen.has(a) && seen.set(a, 1));
};

let arr = [1, 2, 3, 4, 5, 1, 3, 'w', true, true, '1'];
console.log(arr.unique1());
console.log(arr.unique2());
console.log(arr.unique3());

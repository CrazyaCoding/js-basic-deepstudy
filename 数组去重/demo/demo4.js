/**
 * filter + indexOf
 */
Array.prototype.unique = function() {
	let res = [],
		arr = this;
	res = arr.filter(function(item, index) {
		return arr.indexOf(item) === index;
	});
	return res;
};

let arr = [1, 2, 3, 4, 5, 1, 3, 'w', true, true, '1'];
console.log(arr.unique());

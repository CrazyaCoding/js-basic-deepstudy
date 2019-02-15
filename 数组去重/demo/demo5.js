/**
 * filter + 排序
 */
Array.prototype.unique = function() {
	let res = [],
		arr = this.concat().sort();
	res = arr.filter(function(item, index) {
		return index === 0 || item !== arr[index - 1];
	});
	return res;
};

let arr = [1, 2, 3, 4, 5, 1, 3, 'w', true, true, '1'];
console.log(arr.unique());

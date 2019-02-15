/**
 * indexof 一层循环法
 */
Array.prototype.unique = function() {
	let arr = [];
	for (let i = 0; i < this.length; i++) {
		if (arr.indexOf(this[i]) === -1) {
			arr.push(this[i]);
		}
	}
	return arr;
};

let arr = [1, 2, 3, 4, 5, 1, 3, 'w', true, true, '1'];
console.log(arr.unique());

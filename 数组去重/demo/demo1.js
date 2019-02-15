/**
 * 两层循环
 */
Array.prototype.unique = function() {
	var res = [];
	for (let i = 0; i < this.length; i++) {
		for (var j = 0; j < res.length; j++) {
			if (this[i] === res[j]) {
				break;
			}
		}
		if (j === res.length) {
			res.push(this[i]);
		}
	}
	return res;
};
let arr = [1, 1, '1', '1', 'on'];
console.log(arr.unique());

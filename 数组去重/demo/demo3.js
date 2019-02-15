/**
 * 排序法
 */
Array.prototype.unique = function() {
	let res = [],
		sortArr = this.concat().sort(),
		seen;
	for (let i = 0; i < sortArr.length; i++) {
		if (i === 0 || seen !== sortArr[i]) {
			res.push(sortArr[i]);
		}
		seen = sortArr[i];
	}
	return res;
};

let arr = [1, 2, 3, 4, 5, 1, 3, 'w', true, true, '1'];
console.log(arr.unique());

/**
 * Object键值对
 */
Array.prototype.unique = function() {
	let obj = {},
		res = [];
	res = this.filter(function(item, index) {
		// 这种情况 1 ‘1’会有问题 因为对象的key值必须是字符串
		//return obj.hasOwnProperty(item) ? false : (obj[item] = true);
		return obj.hasOwnProperty(typeof item + JSON.stringify(item))
			? false
			: (obj[typeof item + JSON.stringify(item)] = true);
	});
	return res;
};

let arr = [1, 2, 3, 4, 5, 1, 3, 'w', true, true, '1'];
console.log(arr.unique());

/**
 * Created by shangpanpan on 2018/1/18.
 */
/**
 * 加了状态后，可以通过判断状态来解决调用先后顺序的问题
 * 在resolve执行前调用then()，表明这时value还没有处理好，这时的状态是pending，此时保留then的回调哈书，调用resolve处理好value后在执行回掉函数，此时回掉函数在deferred中
 * 在resolve()执行后调用then()，表明这时value已经通过resolve()处理完成了，调用then就可以通过传入的回调函数处理value值
 *
 * */
function Promise(fn) {
	let state = 'pending', //  维护Promise实例的状态
		value,  // 传进来的value test使用
		deferred; // 在状态还处于pending时用于保存回掉函数的引用
	function resolve(newVal) {
		value = newVal;
		state = 'resolve';
		if (deferred) {
			handle(deferred);
		}
	}
	function handle(onResolved) {
		if (state === 'pending') {
			deferred = onResolved;
			return;
		}
		onResolved(value);
	}
	this.then = function(onResolved) {
		handle(onResolved);
	};
	fn(resolve);
}

function doSomething() {
	return new Promise(function (resolve) {
		let val = 42;
		resolve(val);
	})
}

doSomething().then(function (value) {
	console.log("get a value", value);
});

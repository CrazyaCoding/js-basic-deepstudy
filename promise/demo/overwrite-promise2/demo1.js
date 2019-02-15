/**
 * Created by shangpanpan on 2018/1/18.
 */
function Promise(fn) {
	let callback = null;
	this.then = function(cb) {
		callback = cb;
	};
	function resolve(value) {
		// 在这里设置callback在下一个event loop上执行
		// 到现在还没有执行then方法
		// 在then方法执行后callback变有值，在执行setTimeout
		setTimeout(function(){
			callback(value)
		}, 1)
	}
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

//该版本如果then异步调用的话，还是会导致Promise中的callback为null。
/**
 * var promise = doSomething();

 	setTimeout(function() {
	    promise.then(function(value) {
	    	console.log("got a value", value);
		})
	}, 1);
 * */
/**
 * Created by shangpanpan on 2018/1/17.
 */
/***
 * 在实现了done方法的基础上，就可以实现then方法了，它们没有本质的区别，但then能够返回一个新的Promise
 */


const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function Promise(fn) {
	// 存储该 Promise 的状态信息
	let state = PENDING;

	// 存储 FULFILLED 或 REJECTED 时带来的数据
	let value = null;

	//存储 then 或 done 时调用的成功或失败回调
	let handlers = [];

	function fulfill(result) {
		state = FULFILLED;
		value = result;
	}

	function reject(error) {
		state = REJECTED;
		value = error;
	}

	/***
	 * resolve
	 * @param result 即可以是一个Promise，也可以是一个基本类型，如果是一个Promise时，就使用doResolve辅助函数来执行这个Promise并等待其完成
	 * 通过暴露resolve而隐藏底层的fulfill接口，从而包装来一个Promise一定不会被另一个Promise所fulfilll
	 */
	function resolve(result) {
		try{
			let then = getThen(result);
			if (then){
				doResolve(then.bind(result), resolve, reject);
				return;
			}
			fulfill(result);
		}catch(e) {
			reject(e);
		}
	}

	//两个辅助函数

	/***
	 * 检查一个值是否为Promise
	 * 若为Promise则返回Promise的then方法
	 * @param {Promise | Any} value
	 * @returns {Function | Null}
	 */
	function getThen(value) {
		let t = typeof value;
		if(value && (t === 'Object' || t === 'function')) {
			const then = value.then;
			if(typeof then === 'function') {
				return then;
			}
			return null;
		}
	}

	/***
	 * 传入一个需要被resolve的函数，该函数存在不确定行为
	 * 确保 onFulfilled 与 onRejected 只会被调用一次
	 * 在此不保证该函数一定会异步执行
	 *
	 * @param {Function} fn 不能被信任的回调函数
	 * @param {Function} onFulfilled
	 * @param {Function} onRejected
	 */
	function doResolve(fn, onFulfilled, onRejected) {
		let done = false;
		try{
			fn(function(value){

				if(done) return;
				done = true;
				onFulfilled(value);

			}, function(error){

				if(done) return;
				done = true;
				onRejected(error);

			})
		}catch(e) {

			if(done) return;
			done = true;
			onRejected(e);

		}
	}

	/*********************************新增部分*********************************/
	// 保证done中回调的执行
	function handle(handler) {
		if (state === PENDING) {
			handlers.push(handler)
		} else {
			if (state === FULFILLED && typeof handler.onFulfilled === 'function') {
				handler.onFulfilled(value);
			}
		}	if(state === REJECTED && typeof handler.onRejected === 'function') {
			handler.onRejected(value);
		}
	}

	// 在Promise的状态迁移至resolved或rejected时，所有的done注册的观察者handler都行被执行，并且这个操作总是在下一个tick异步执行的
	this.done = function(onFulfilled, onRejected) {
		// 保证done总是异步执行
		setTimeout(function(){
			handle({
				onFulfilled: onFulfilled,
				onRejected: onRejected
			})
		}, 0)
	};

	this.then = function(onFuilled, onRejected) {
		const _this = this;
		return new Promise(function(resolve, reject) {
			return _this.done(function(result) {
				if (typeof onFuilled === 'function') {
					try{
						return resolve(onFuilled(result));
					}catch(e) {
						return reject(e);
					}
				} else {
					return resolve(result);
				}
			}, function(error) {
				if( typeof onRejected === 'function') {
					try {
						return resolve(onRejected);
					} catch (e) {
						return reject(e);
					}
				} else {
					return reject(error);
				}
			})
		});
	};

	//可以发现这里重用了 doResolve 以执行不被信任的 fn 函数。这个 fn 函数可以多次调用 resolve 和 reject 接口，甚至抛出异常，但 Promise 中对其进行了限制，保证每个 Promise 只能被 resolve 一次，且在 resolve 后不再发生状态转移。
	doResolve(fn, resolve, reject)


}

let a = new Promise(function(resolve){
	return resolve(10);
});
a.then(e => console.log(e));
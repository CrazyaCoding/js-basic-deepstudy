/**
 * Created by shangpanpan on 2018/1/17.
 */
/**状态迁移
 * 指定状态机的状态之后，可以实现基本的状态迁移功能，即fulfill与reject这两个用于改变状态的函数
 * 在两种底层的状态迁移基础上，实现一种更高级的状态迁移方式，就是resolve了
 * */

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function Promise() {
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
}

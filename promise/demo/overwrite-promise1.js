/**
 * Created by shangpanpan on 2018/1/17.
 */
/** 状态机
 *  一个Promise可以理解为一个状态机，响应的API接口要么用于改变状态机的状态，要么在到达某个状态机时被触发
 *  因此，首先需要实现的，是Promise的状态信息
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
}

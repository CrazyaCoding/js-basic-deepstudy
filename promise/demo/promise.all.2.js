/**
 * Created by shangpanpan on 2018/1/17.
 */

/*run node promise.all.test.js*/
function getDataA(){
	return new Promise(resolve => {
		let data = 'A';
		resolve(data);
	});
};

function getDataB(){
	return new Promise(resolve => {
		let data = 'B';
		resolve(data);
	});
};

function getDataC(){
	return new Promise((resolve, rejected) => {
		let error = 'error';
		rejected(error);
	}).catch(e => e)
};

Promise.all([getDataA(), getDataB(), getDataC()])
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.log(error);
	});
/***
 * getDataC is rejected:error  //触发的是作为参数的promise的catch，之后又返回一个新的promise实例，现在的getDataC指向的就是这个实例，getDataC执行完catch后也会变成resolved
 * [ 'A', 'B', undefined ]  //此时，Promise.all的两个参数均为resolved，因此会调用then方法，而不会调用catch
 */
/*如果作为参数的没有自己的catch，就会调用Promise.add的catch方法*/

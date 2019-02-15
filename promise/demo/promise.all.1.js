/**
 * Created by shangpanpan on 2018/1/17.
 */

/*run node promise.all.1.js*/
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
		let data = 'C';
		//rejected(data); 尝试打开注释，对下面一行标记注释，运行结果
		resolve(data);
	});
};

Promise.all([getDataA(), getDataB(), getDataC()])
	.then(data => {
		console.log(data);
	})
	.catch(error => {
		console.log('error' + error);
	});
/**
 * [ 'A', 'B', 'C' ]
 * */

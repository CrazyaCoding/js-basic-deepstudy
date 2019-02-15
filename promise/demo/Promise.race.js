/**
 * Created by shangpanpan on 2018/1/17.
 */
/*run node promise.race.js*/
function getDataA(){
	return new Promise(resolve => {
		let data = 'A';
		resolve(data);
	});
};

function getDataB(){
	return new Promise((resolve, rejected) => {
		let data = 'B';
		rejected(data);
	});
};

function getDataC(){
	return new Promise(resolve => {
		let data = 'C';
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
 * errorB
 * */

#promise的深入学习
##为什么会产生promise
    目前，我们对于异步函数的处理均是来源于回调函数，与普通函数不同的是，回调函数的内容是异步操作完成后的后续逻辑，并被第三方调用

以ajax为例子
```
ajax.get('xxx', dataA => {
    ajax.get('yyy', dataB => {
        //handle
    })
})
```
这样一来，在处理越来越多的异步逻辑时，回调也就越深
会产生如下几个问题：
* 代码逻辑书写顺序与执行顺序不一致，不利于阅读与维护
* 异步操作的顺序变更时，需要大规模的代码重构
* 回掉函数基本都是匿名函数，bug追踪困难
* 回调函数是被第三方库代码调用，而非自己的业务代码所调用，造成了控制反转

其中，最后一个问题是编码中的最大的问题，由于回掉函数是被第三方库调用的，因此无法预期自己被执行时的环境，可能会导致：
* 回调被执行了多次
* 回调一次都没有被执行
* 回调不是异步执行而是被同步执行
* 回调被过早执行或过晚执行
* 回调中的报错被第三方吞噬掉

以上述为例，基于promise的例子是这样的
```
    function getDataA(){
        return new Promise((resolve, reject) => {
            ajax.get('xxx', dataA => {
                resolve(dataA)
            })
        })
    }
    function getDataB(dataA){
        return new Promise((resolve, reject) => {
            ajax.get('xxx'+dataA, dataB => {
                resolve(dataB)
            })
    }
    getDataA()
    .then(dataA => {getDataB(dataA)})
    .then(dataB => console.log(dataB))
```
##基础概念
    在上面的例子中，其实promise充当了一个中间机的作用，将回调造成的控制反转再反转回去。
    在promise的例子中，控制流分成了两个部分，触发异步钱的逻辑通过new传入promise，而异步操作完成后的逻辑则传入promise的then接口中，通过这种方式，第一方业务和第三方库的响应逻辑都由primise来调用，进而在promise中解决异步变成可能出现
##API
一个promise有以下几种状态
* pending: 初始状态，成功或失败状态
* fulfilled: 意味这操作成功完成
* rejected: 意味着操作失败

[看这样一张图](https://mdn.mozillademos.org/files/8633/promises.png)
![promise](./promises.png)

###属性
`Promise.length` length属性，其值总是为1（构造器参数的数目）
`Promise.prototype` 表示Promise构造器的原型

###方法

####Promise.all(iterable)
用于将多个Promise实例，包装成一个新的Promise实例
```
const p = Promise.all([p1, p2, p3]);
```
    Promise.all方法接受一个数组作为参数，p1, p2, p3都是Promise实例，如果不是，就会调用Promise.resolve方法，转为Promise实例，再进一步处理。（Promise.all方法的参数可以不是数组，但必须具有Iterator接口，且返回的每个成员都是Promise实例）
    p的状态由p1,p2,p3决定，分两种情况
    1. 只有p1, p2, p3的状态都变成fulfilled, p的状态才会变成fulfilled，此时，p1, p2, p3的返回值组成一个数组，传递给p的回调函数
    2. 只要p1, p2, p3之中有一个被rejected，p的状态就变成rejected，此时，第一个被reject的实例的返回值，会传递给p的回掉函数

例子见：./demo/promise.all.1.js

如果作为参数的Promise实例，自己定义了catch方法，那么它一旦被rejected，就不会触发Promise.all的catch方法
见：./demo/promise.all.2.js

####Promise.race(iterable)
该方法同样是将多个Promise实例，包装成一个新的Promise实例
```
const p = new Promise.race([p1, p2, p3]);
```
那么上面代码中，只要p1,p2,p3之中有一个实例率先改变状态，p的状态就跟着改变，那个率先改变状态的promise的返回值，就作为参数传递给p的回掉函数
如果参数不是Promise的实例，就会调用Promise.resolve方法，转为Promise实例
见Promise.race.js

####Promise.resolve()
有时需要将现有对象转为Promise对象，该方法就起到这个作用
```
const jsPromise = Promise.resolve($.ajax('./whatever.json'))
```

```
Promise.resolve('foo');
// 等价于
new Promise(resolve => resolve('foo'))
```
    Promise.resolve的参数分成四种情况
    （1）参数是一个promise实例
        如果参数本身就是Promise实例，那么Promise.resolve将不做任何修改，直接返回实例
    （2）参数是一个thenable对象
        thenable对象值的就是具有then方法的对象
        let thenable = {
            then: function(resolve){
                resolve(1);
            }
        }
        let p1 = Promise.resolve(thenable); //会转换完并执行then方法后在返回
        p1.then(function(value){
            console.log(value);  //1
        })
        
    （3）参数不是具有then方法的对象，或根本不是对象
        const p = Promise.resolve('hello');
        p.then(function(e){
            console.log(e); //hello
        })

    (4) 不带有任何参数
        直接返回一个Promise对象，但是需要注意的是，即使是立即执行的，也会排在当前的事件队列后面，是在本轮"事件循环"（event loop）结束时，而不是在下一轮"事件循环"的开始时。
        setTimeout(function(){
            console.log('3');
        }, 0);
        Promise.resolve().then(function(){
            console.log(2);
        });
        console.log(1);
        // 1
        // 2
        // 3
        setTimeout(fn, 0)在下一轮"事件循环"开始时执行，
        Promise.resolve()在本轮 "事件循环" 结束时开始执行
        console.log('1') 时立即执行
        
####Promise.rejected()
Promise.rejected方法也会返沪一个新的Promise实例，该实例的状态为rejected
```
const p = new Promise.rejected('出错了')
// 等价于
const p = new Promise((resolve, rejected) => rejected('出错了'))
```
那么，Promise.rejected()方法的参数，会原封不动的作为reject的理由，变成后续的参数，这一点与Promise.resolve不一致
```
const thenable = {
    then: function(resolve, reject){
        reject('出错了');
    }
}

Promise.reject(thenable).cathch(e => {
    console.log(e === thenable); //true
})

```


##源码重写

##参考
[promise源码阅读](http://ewind.us/2017/promise-implementing/)
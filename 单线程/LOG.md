# Javascript是单线程
    Javascript引擎是单线程运行的，浏览器在什么时候，都且只有一个线程在运行javascript
    浏览器的内核是多线程的，它们在内核控制下相互配合以保持同步，一个浏览器至少实现三个常驻引擎：javascript引擎线程、GUI渲染线程、浏览器事件触发线程
    javascript引擎线程：是基于事件驱动单线程执行的，javascript引擎一直等待着任务队列中任务的到来，
    GUI渲染线程：负责渲染浏览器界面，当界面需要重绘（Repaint）或者由于某种操作引发回流时，该线程就会执行。需要注意的是GUI与上面javascript引擎是互斥的，当javascript引擎执行时GUI线程就会被挂起，GUI更新会被保存在一个队列中，等到javascript引擎空闲时立即执行。
    事件触发线程：当一个事件被触发时该线程会把事件添加到待处理队列的队尾，等待javascript引擎的处理，事件可以是setTimeout、ajax，也可来自浏览器内核的其他线程的鼠标点击，ajax异步请求等，所有这些事件都得排队等待javascript引擎处理































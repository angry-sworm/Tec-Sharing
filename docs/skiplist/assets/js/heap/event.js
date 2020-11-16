function EventListener()
{
	this.listeners = {};
    this.maxListener = 10;
}

EventListener.prototype.removeListener = function(event, listener)
{
	var listeners = this.listeners;
    var arr = listeners[event] || [];
    var i = arr.indexOf(listener);
    if (i >= 0) {
        listeners[event].splice(i, 1);
    }
}

EventListener.prototype.on = function(event, cb)
{
	var listeners = this.listeners;
    if (listeners[event] && listeners[event].length >= this.maxListener) {
        throw console.error('监听器的最大数量是%d,您已超出限制', this.maxListener)
    }
    if (listeners[event] instanceof Array) {
        if (listeners[event].indexOf(cb) === -1) {
            listeners[event].push(cb);
        }
    } else {
        listeners[event] = [].concat(cb);
    }
}
EventListener.prototype.addListener = EventListener.prototype.on;

EventListener.prototype.emit = function (event) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    this.listeners[event].forEach(cb => {
        cb.apply(null, args);
    });
}

EventListener.prototype.removeAllListener = function (event) {
    this.listeners[event] = [];
}

EventListener.prototype.listeners = function (event) {
    return this.listeners[event];
}

EventListener.prototype.setMaxListeners = function (num) {
    this.maxListener = num;
}
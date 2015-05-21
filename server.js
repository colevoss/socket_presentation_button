var koa = require('koa');
var logger = require('koa-logger');
var koa_static = require('koa-static');
var socket = require('socket.io');

var app = koa();

function* responseTime(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
}

app.use(responseTime)
   .use(logger())
   .use(koa_static(__dirname + '/build'));

var server = require('http').createServer(app.callback());
io = socket(server);

var buttonTime;
var connections = 0;

// Set time and start interval countdown
resetTime();


io.on('connection', function(socket) {
  // Add a connection when someone connects
  connections += 1;

  // Tell everyone that someone else is connected
  io.emit('connectSuccess', {
    connections: connections
  });

  // Tell everyone that someone left
  socket.on('disconnect', function() {
    connections -= 1;

    // Using broad cast for no real reason but
    // in other circumstances this would emit the
    // message to everyone but the person who sent it.
    socket.broadcast.emit('disconnectedUser', {
      connections: connections
    });
  });


  // Tell everyone that the button was pushed and
  // reset the timer
  socket.on('buttonPush', function() {
    resetTime(buttonTime);
    io.emit('buttonTime', {buttonTime: buttonTime});
  });

  console.log('Socket connection');
});

function runTimer() {
    return setInterval(function() {
      buttonTime -= 1;
      sendTime()
    }, 1000);
}

var timer = runTimer();

function resetTime(wasTime) {
  buttonTime = 60;
  if (wasTime == 0) {
    timer = runTimer();
  }
}

function sendTime() {
  if (buttonTime == 0) {
    clearInterval(timer);
  }
  io.emit('buttonTime', {buttonTime: buttonTime});
}


server.listen(3000);
console.log('Koa is listening on port 3000');
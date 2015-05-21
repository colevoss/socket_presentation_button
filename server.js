var koa = require('koa');
var favicon = require('koa-favicon');
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
   .use(koa_static(__dirname + '/build'))
   .use(favicon(__dirname + '/build/favicon.ico'));

var server = require('http').createServer(app.callback());
io = socket(server);

var buttonTime;
var connections = 0;

// Set time and start interval countdown
resetTime();


io.on('connection', function(socket) {
  // Add a connection when someone connects
  connections += 1;

  console.log('!!!!!!!!!!!!!!!!!');
  console.log('SOMEONE CONNECTED');
  console.log('!!!!!!!!!!!!!!!!!');

  // Tell everyone that someone else is connected
  io.emit('connectSuccess', {
    connections: connections
  });

  // Tell everyone that someone left
  socket.on('disconnect', function() {
    connections -= 1;

    console.log('!!!!!!!!!!!!!!!!!');
    console.log('SOMEONE LEFT');
    console.log('!!!!!!!!!!!!!!!!!');

    // Using broad cast for no real reason but
    // in other circumstances this would emit the
    // message to everyone but the person who sent it.
    socket.broadcast.emit('disconnectedUser', {
      connections: connections
    });
  });


  // Tell everyone that the button was pushed and
  // reset the timer
  socket.on('buttonPush', function(msg, fn) {
    console.log(msg);
    fn('This gets passed back to the client!');

    console.log('!!!!!!!!!!!!!!!!!');
    console.log('BUTTON WAS PUSHED');
    console.log('!!!!!!!!!!!!!!!!!');

    resetTime(buttonTime);

    socket.emit('buttonTime', {buttonTime: buttonTime});
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


var port = process.env.PORT || 3000;
server.listen(port);
console.log('Koa is listening on port ' + port);

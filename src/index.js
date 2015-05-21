// index.js

import React from 'react';
import App from './components/app.js';
import socket from './socket';

window.onbeforeunload = function(e) {
  socket.disconnect();
}

React.render(<App/>, document.body);

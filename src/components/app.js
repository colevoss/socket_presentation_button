// app.js

import React from 'react';
import socket from '../socket';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      buttonTime: 0,
      status: 'ok', // also can be 'meh', 'frick' and 'omgomg'
      frick: false, // When the timer hits 0
      connections: 0
    };

    socket.on('connectSuccess', (data) => {
      this.setState({
        connections: data.connections
      });
    });

    socket.on('disconnectedUser', (data) => {
      this.setState({
        connections: data.connections
      });
    });

    socket.on('buttonTime', (data) => {
      this.setState({
        buttonTime: data.buttonTime,
        status: this.status(data.buttonTime),
        frick: !(data.buttonTime > 0),
      });
    });
  }

  status(time) {
    if (time > 40) {
      return 'ok';
    } else if (time <= 40 && time > 20) {
      return 'meh';
    } else if (time <= 20 && time > 10) {
      return 'frick';
    } else if (time <= 10) {
      return 'omgomg';
    }
  }


  pushButton() {
    socket.emit('buttonPush', 'pushButton', function(data) {
      console.log(data)
    });
  }

  render() {
    return (
      <div style={style.container}>
        <div style={style.buttonContainer}>
          <h1>The Button</h1>
          <div># of People That can press button: {this.state.connections}</div>
          <a href='#' style={style.button[this.state.status]} onClick={this.pushButton}>Button</a>
          <h2 style={style.counter}>{this.state.buttonTime}</h2>
          {this.state.frick ? <img src="http://media.giphy.com/media/13aSSyJaI5NkTm/giphy.gif" /> : null}
        </div>
      </div>
    );
  }
}

export default App;

const fontFamily = '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif';

var style = {
  container: {
    width: '100%',
    height: '100%',
    display: '-webkit-flex',
    flexDirection: 'column',
    WebkitFlexDirection: 'column',
    justifyContent: 'center',
    WebkitJustifyContent: 'center',
    fontFamily: fontFamily,
    fontWeight: '300'
  },

  buttonContainer: {
    width: '50%',
    alignSelf: 'center',
    WebkitAlignSelf: 'center',
    textAlign: 'center',
    background: '#ccc',
  },

  button: {
    ok: {
      padding: '15px',
      background: '#003366',
      color: '#fff',
      textDecoration: 'none',
      boxShadow: '2px 2px 2px #ccc',
      display: 'inline-block'
    },
    meh: {
      padding: '15px',
      background: '#009933',
      color: '#fff',
      textDecoration: 'none',
      boxShadow: '2px 2px 2px #ccc',
      display: 'inline-block'
    },
    frick: {
      padding: '15px',
      background: '#FFFF00',
      color: '#000',
      textDecoration: 'none',
      boxShadow: '2px 2px 2px #ccc',
      display: 'inline-block'
    },
    omgomg: {
      padding: '15px',
      background: '#FF0000',
      color: '#fff',
      textDecoration: 'none',
      boxShadow: '2px 2px 2px #ccc',
      display: 'inline-block'
    }
  },
}

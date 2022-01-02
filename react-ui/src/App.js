import logo from './logo.svg';
import './App.css';

import WebSocket from 'ws';
const ws = new WebSocket('ws://omnipodstash.herokuapp.com');


ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React Kalle_2!
        </a>
      </header>
    </div>
  );
}

export default App;

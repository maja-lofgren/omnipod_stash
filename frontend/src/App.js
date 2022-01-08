import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function App() {

  const [nrOfPodsToAdd, setNrOfPodsToAdd] = useState();
  const [podCount, setpodCount] = useState();


  const updatepodcount = async () => {
    try {
      let podsToAdd = nrOfPodsToAdd;
      setNrOfPodsToAdd("");
      const res = await axios.get('/addtopodcount/' + podsToAdd);
      await getpodcount();
    } catch (e) {
      console.log(e);
    }
  };
  
  const getpodcount = async () => {
    try {
      const res = await axios.get('/getpodcount');

      if (res.data.podCount !== undefined) {
        setpodCount(res.data.podCount);
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  getpodcount();

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Current pod count: {podCount}
          <br />
          <input type="text" value={nrOfPodsToAdd} onChange={(e) => setNrOfPodsToAdd(e.target.value)} style={{textAlign: 'center', width:'40px'}} />
          <br />
          <button onClick={updatepodcount}>Update pod-count</button>
        </p>

      </header>
    </div>
  );
}

export default App;

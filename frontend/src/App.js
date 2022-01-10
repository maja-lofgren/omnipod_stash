import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function App() {

  const [nrOfPodsToAdd, setNrOfPodsToAdd] = useState();
  const [nrOfPodsTotal, setNrOfPods] = useState();
  const [podCount, setpodCount] = useState();


  const updatePodCountAddition = async () => {
    try {
      let podsToAdd = nrOfPodsToAdd;
      setNrOfPodsToAdd("");

      if(isNaN(+podsToAdd)){
        console.log("not a number!");
        alert("Not a number!")
        return;
      }
      const res = await axios.get('/addtopodcount/' + podsToAdd);
      await getpodcount();
    } catch (e) {
      console.log(e);
    }
  };
  const setPodCountTotal = async () => {
    try {
      let podsTotal = nrOfPodsTotal;
      setNrOfPods("");
      if(isNaN(+podsTotal)){
        console.log("not a number!");
        alert("Not a number!")
        return;
      }
      const res = await axios.get('/setpodcount/' + podsTotal);
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
          Current pod-count in db: {podCount}
          <br /><br /> <br />
          <div style={{ float: 'left' }}>
            <text style={{marginRight:"5px"}}>Add pods:</text> 
            <input type="text" value={nrOfPodsToAdd} onChange={(e) => setNrOfPodsToAdd(e.target.value)} style={{ textAlign: 'center', marginRight:"5px", width: '40px' }} />
            <button onClick={updatePodCountAddition}>Add pods!</button>
            <div style={{ clear: "both" }} />
          </div>
          <br />
          <br />
          <div style={{ float: 'left' }}>
            <text style={{marginRight:"5px"}}>Set count:</text> 
            <input type="text" value={nrOfPodsTotal} onChange={(e) => setNrOfPods(e.target.value)} style={{ textAlign: 'center', marginRight:"5px", width: '40px' }} />
            <button onClick={setPodCountTotal}>Set count!</button>
            <div style={{ clear: "both" }} />
          </div>
          <br />
        </p>

      </header>
    </div>
  );
}

export default App;

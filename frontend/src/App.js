import './App.css';
import axios from 'axios';
import React, { useState } from 'react';

function App() {

  const [nrOfPodsToAdd, setNrOfPodsToAdd] = useState();
  const [nrOfPodsTotal, setNrOfPods] = useState();
  const [podCount, setpodCount] = useState("-");
  const [buttonActive, setbuttonActive] = useState(true);

  const updatePodCountAddition = async (e) => {
    try {
      var podsToAdd = nrOfPodsToAdd;
      if (e != null) {
        podsToAdd = e;
      }
      setNrOfPodsToAdd("");
      setbuttonActive(false);
      if (isNaN(+podsToAdd)) {
        console.log("not a number!");
        alert("Not a number!")
        return;
      }
      const res = await axios.get('/addtopodcount/' + podsToAdd);
      await getpodcount();
    } catch (e) {
      console.log(e);
    } finally {
      setbuttonActive(true);
    }
  };
  const setPodCountTotal = async () => {
    try {
      let podsTotal = nrOfPodsTotal;
      setNrOfPods("");
      setbuttonActive(false);

      if (isNaN(+podsTotal)) {
        console.log("not a number!");
        alert("Not a number!")
        return;
      }
      const res = await axios.get('/setpodcount/' + podsTotal);
      await getpodcount();
    } catch (e) {
      console.log(e);
    } finally {
      setbuttonActive(true);
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
      <text style={{ fontSize: "40px" }}>
        Current pod-count
        </text>
        <text style={{ fontSize: "70px" }}>
          {podCount}
        </text>

        <br /><br />

        <div style={{ textAlign: 'right' }}>
          <text>Register new pods:</text>
          <input type="text"
            autoFocus
            value={nrOfPodsToAdd}
            onChange={(e) => setNrOfPodsToAdd(e.target.value)}
            style={{ width: '40px', textAlign: 'center' }}
            title="adds x-number of pods to stash (negative or positive number)"
          />
          <button onClick={() => updatePodCountAddition(null)} disabled={!buttonActive}>Add pods</button>
          <br />
          <br />
          <text style={{ marginRight: "5px" }}>Set total podcount:</text>
          <input type="text"
            value={nrOfPodsTotal}
            onChange={(e) => setNrOfPods(e.target.value)}
            style={{ width: '40px', textAlign: 'center' }}
            title="Sets current number of pods in stash (positive number)"
          />
          <button onClick={setPodCountTotal} disabled={!buttonActive}>Set pods</button>
        </div>
        <br />
        <br />
        <div>
          <p style={{ textAlign: 'center' }}> Quick-add</p>
          <button onClick={() => updatePodCountAddition(-1)} disabled={!buttonActive}>-1</button>
          <button onClick={() => updatePodCountAddition(1)} disabled={!buttonActive}>1</button>
          <br />
          <br />
          <button onClick={() => updatePodCountAddition(5)} disabled={!buttonActive}>5</button>
          <button onClick={() => updatePodCountAddition(10)} disabled={!buttonActive}>10</button>
        </div>

        <br />

      </header>
    </div>
  );
}

export default App;

import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Mainpage from './Mainpage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Mainpage Typ="pod" />} />
            <Route path="/pod" element={<Mainpage Typ="pod" />} />
            <Route path="/sensor" element={<Mainpage Typ="sensor" />} />
            <Route path="/insulin" element={<Mainpage Typ="insulin" />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;

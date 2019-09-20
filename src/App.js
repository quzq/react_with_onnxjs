import React, {useState} from 'react';
import './App.css';

import OnnxAdd from "./components/OnnxAdd";
import OnnxMnist from "./components/OnnxMnist";

const App = () => {

  return (

    <div className="App">
      <OnnxAdd></OnnxAdd>
      <OnnxMnist></OnnxMnist>
    </div>
  );
}

export default App;

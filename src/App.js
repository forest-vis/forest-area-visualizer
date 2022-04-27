import React, { Component } from 'react';
import MainScene from './scenes/MainScene';
import './App.scss';
import Logo from "./logo.svg";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <MainScene />
        <img alt='logo' src={Logo} />
      </div>
    );
  }
}

export default App;

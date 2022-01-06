// noinspection JSIgnoredPromiseFromCall

import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  useEffect(() => {
    setTimeout(() => {
      testThrowError();
    })
  });

  const testThrowError = async () => {
    throw new Error("😭😭 React App 的 <App/> 组件又产生了一个错误 😭😭");
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

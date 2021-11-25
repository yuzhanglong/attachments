import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
import { renderRoutes } from "react-router-config";
import { routes } from "~src/routes";
import "./utils/init-common";
import "@attachments/utils/src/browser/css/common.css";

// @ts-ignore
window.intl = (a, b) => {
  return a + JSON.stringify(b);
};

const App = () => {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Suspense>
  );
};


const reactRenderer = () => {
  ReactDOM.render((
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ), document.getElementById("my-app"));
};

const beforeAppStart = async () => {
  return true;
};

beforeAppStart()
  .then(() => {
    reactRenderer();
  });



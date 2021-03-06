import "bootstrap/dist/css/bootstrap-theme.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import ReactDOM from 'react-dom';
import ArchimateNavigator from "./components/archimate-navigator";
import './index.css';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
  <ArchimateNavigator modelUrl="./archimate/ArchiSurance V3.archimate" />,
  // <ArchimateNavigator modelUrl="/archimate/everything.archimate" />,
  // <ArchimateNavigator modelUrl="/archimate/sample.archimate" />,
  document.getElementById("root") as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

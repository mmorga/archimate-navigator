import "bootstrap/dist/css/bootstrap-theme.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import ArchimateNavigator from "./components/archimate-navigator";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <ArchimateNavigator modelUrl="/archimate/Archisurance V3.archimate" />,
  // <ArchimateNavigator modelUrl="/archimate/everything.archimate" />,
  // <ArchimateNavigator modelUrl="/archimate/sample.archimate" />,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();

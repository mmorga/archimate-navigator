// import "bootstrap/dist/css/bootstrap-theme.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";
import ArchimateNavigator from "./components/archimate-navigator";
import "./index.css";
import { StrictMode } from "react";
import modelUrl from "/archimate/ArchiSurance V3.archimate?url";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
  <StrictMode>
    <ArchimateNavigator modelUrl={modelUrl} />
  </StrictMode>,
  // <ArchimateNavigator modelUrl="/archimate/everything.archimate" />,
  // <ArchimateNavigator modelUrl="/archimate/sample.archimate" />
);

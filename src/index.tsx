import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ArchimateNavigator from './archimate-navigator';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <ArchimateNavigator modelUrl="/archimate/index.json" />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ArchimateNavigator from './archimate-navigator';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// $('[data-toggle="tooltip"]').tooltip();
// const messageCollection = document.querySelector(".archimate-message").children;

ReactDOM.render(
  <ArchimateNavigator />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

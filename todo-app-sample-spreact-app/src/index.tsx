import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Views/App';
import { sp as spfx } from '@pnp/sp'
import { env } from 'process';

// import reportWebVitals from './reportWebVitals';
//require('dotenv').config()
console.log("env : " + env.NODE_ENV);
console.log("env : " + env.SHAREPOINT_SITE);
//set up PNPJS
spfx.setup({ spfxContext: { pageContext: { web: { absoluteUrl: env.SHAREPOINT_SITE || 'https://contoso.sharepoint.com/sites/Test' } } } });
try {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
catch (e) {
  console.log(e);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//  reportWebVitals(console.log);

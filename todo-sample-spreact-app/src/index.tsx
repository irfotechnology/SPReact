import React from 'react';
import ReactDOM from 'react-dom/client';
import { sp as spfx } from '@pnp/sp'
import { AppViewModel } from './ViewModels/AppViewModel';

const host = window.location.origin + window.location.pathname;

console.log("env : " + process.env.NODE_ENV);
console.log("API KEY : " + process.env.REACT_APP_APIKEY);
console.log("host : " + host);

try {
  //set up PNPJS
  spfx.setup({ spfxContext: { pageContext: { web: { absoluteUrl: host + '' } } } });
  //create root element
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  const __AppVM = new AppViewModel(spfx, host);
  if(process.env.NODE_ENV==='development'){
    root.render(
      <React.StrictMode>
        {__AppVM.App}
      </React.StrictMode>
    );
  }
  else{
    root.render(__AppVM.App);
  }

} catch (error) {
  console.log(error);
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//  reportWebVitals(console.log);

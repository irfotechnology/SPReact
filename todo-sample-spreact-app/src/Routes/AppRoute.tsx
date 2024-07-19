import React from 'react';
import { Routes,Route, HashRouter  } from 'react-router-dom';
import {AppRouteConfig} from './AppRoute.config';

function AppRoute() {
    return (
        <HashRouter>
          <Routes>
            {AppRouteConfig.pages.map((page)=>{
              return <Route key={page.name} path={page.href} Component={page.component as any} />;
            })}
          </Routes> 
        </HashRouter>
      );
}

export default AppRoute;
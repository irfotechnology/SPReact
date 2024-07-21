import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { AppRouteConfig } from './AppRoute.config';
import { UserProvider } from '../AppContext/UserContext';
import { IAppContext } from '../AppContext/IAppContext';

function AppRoute(props: IAppContext) {
  return (
    <UserProvider value={props}>
      <HashRouter>
        <Routes>
          {AppRouteConfig.pages.map((page) => {
            return <Route key={page.name} path={page.href} Component={page.component as any} />;
          })}
          <Route key='invalid page' path={'/*'} element={<>Invalid Page</>} />
        </Routes>
      </HashRouter>
    </UserProvider>
  );
}

export default AppRoute;
import { ReactElement } from 'react';
import { ISPListProvider } from '../Providers/ISPListProvider';
import { IAppContext } from '../AppContext/IAppContext';

export interface IAppViewModel{
    DefaultSPListProvider: ISPListProvider;
    App: ReactElement<IAppContext>;
}
import * as React from 'react';
import { IAppContext } from './IAppContext';

const defaultValue: IAppContext = {} as IAppContext;
const UserContext = React.createContext(defaultValue);
export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default UserContext;
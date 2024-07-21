import React from "react";
import { ReactElement } from "react";
import { IAppContext } from "../AppContext/IAppContext";
import { ISPListProvider } from "../Providers/ISPListProvider";
import { IAppViewModel } from "./IAppViewModel";
import SPListProvider from "../Providers/SPListProvider";
import AppRoute from "../Routes/AppRoute";
import { IAppNotificationService } from "../Services/IAppNotificationService";
import AppNotificationService from "../Services/AppNotificationService";

export class AppViewModel implements IAppViewModel {
    public DefaultSPListProvider: ISPListProvider;
    public AppNotificationService: IAppNotificationService;
    public App: ReactElement<IAppContext>;
    private _AppProps: IAppContext;
    constructor(context: any, host:string) {
        this.DefaultSPListProvider = new SPListProvider();
        this.AppNotificationService = new AppNotificationService();
        this._AppProps = <IAppContext>{
            Context: context, 
            DefaultSPListProvider: this.DefaultSPListProvider, 
            SPHost : host,
            AppNotificationService : this.AppNotificationService
        };
        this.App = React.createElement(AppRoute, this._AppProps);
    }
}
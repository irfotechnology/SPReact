import IAppConfig from "../Modules/IAppConfig";


export default interface ISPProvider{
    getAppConfig():Promise<IAppConfig[]>;
    addAppConfig(appConfig: IAppConfig): Promise<boolean>;
    getinstalledApps(appCatalogUrl: string): Promise<IAppConfig[]>;
}

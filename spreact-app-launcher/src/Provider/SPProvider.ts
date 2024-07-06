import IAppConfig from "../Modules/IAppConfig";
import ISPProvider from "./ISPProvider";
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/presets/all';


class SPProvider implements ISPProvider {
    public getAppConfig(): Promise<IAppConfig[]> {
        return new Promise((resolve, reject) => {
            sp.web.lists.getByTitle('SPReact AppConfig').items.getAll().then((__items) => {
                const __apps = __items.map((item) => {
                    return {
                        AppID: item.App_x0020_ID,
                        AppName: item.App_x0020_Name,
                        AppVersion: item.App_x0020_Version
                    } as IAppConfig;
                });
                resolve(__apps);
            }).catch((err) => {
                reject(err);
            })
        });
    }

    public addAppConfig(appConfig: IAppConfig): Promise<boolean> {
        return new Promise((resolve, reject) => {
            sp.web.lists.getByTitle('SPReact AppConfig').items.add({
                'App_x0020_ID': appConfig.AppID,
                'App_x0020_Name': appConfig.AppName,
                'App_x0020_Version' : appConfig.AppVersion
            }).then((v) => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public getinstalledApps(appCatalogUrl: string): Promise<IAppConfig[]> {
        return new Promise((resolve, reject) => {
            Web(appCatalogUrl).lists.getByTitle('App for SPReact').items.getAll().then((apps: any[]) => {
                const __apps = apps.map((app) => {
                    return {
                        AppID: app.AppID,
                        AppName: app.AppTitle,
                        HostSPSite : app.HostSPSite,
                        AppVersion: app.AppVersion
                    } as IAppConfig;
                });
                resolve(__apps);
            }).catch((err) => {
                reject(err);
            })
        });
    }


}

export default SPProvider;
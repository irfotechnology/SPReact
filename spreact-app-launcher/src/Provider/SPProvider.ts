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
                        Id: item.Id,
                        appId: item.AppID,
                        appTitle: item.AppTitle,
                        appVersion: item.AppVersion,
                        description: item.Description,
                        publisher: item.Publisher
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
                'AppID': appConfig.appId,
                'AppTitle': appConfig.appTitle,
                'AppVersion': appConfig.appVersion,
                'Description': appConfig.description,
                'Publisher': appConfig.publisher
            }).then((v) => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public getinstalledApps(appCatalogUrl: string): Promise<IAppConfig[]> {
        return new Promise((resolve, reject) => {
            Web(appCatalogUrl).lists.getByTitle('Apps for SPReact').items.getAll().then((apps: any[]) => {
                const __apps = apps.map((app) => {
                    return {
                        appId: app.AppID,
                        appTitle: app.AppTitle,
                        appVersion: app.AppVersion,
                        description: app.Description,
                        publisher: app.Publisher,
                        HostSPSite: app.HostSPSite,
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
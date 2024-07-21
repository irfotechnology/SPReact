export default interface IAppConfig{
    Id: number;
    appTitle: string;
    appId: string;
    appVersion: string;
    description: string;
    publisher: string;
    HostSPSite?: string;
    mainJS:string;
    mainCss: string;
}
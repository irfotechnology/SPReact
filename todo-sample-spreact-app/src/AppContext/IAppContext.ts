import { ISPListProvider } from "../Providers/ISPListProvider";
import IAppNotificationService from "../Services/AppNotificationService";

export interface IAppContext {
    DefaultSPListProvider : ISPListProvider;
    Context : any;
    SPHost:string;
    AppNotificationService: IAppNotificationService;
}

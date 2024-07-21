import { IAppNotificationService } from "./IAppNotificationService";



class AppNotificationService implements IAppNotificationService{

    public onPostToastMessage!: ((message: string) => void);
    public onShowAppMessage!: ((message: string, messageType: number) => void);
    public onIsLoading! : ((value: boolean) => void);

    public isLoading(value: boolean):void {
        this.onIsLoading(value);
    }

    public postToastMessage(message: string): void {
        this.onPostToastMessage(message);
    }

    public showAppMessage(message: string, messageType: number): void {
        this.onShowAppMessage(message, messageType);
    }
}

export default AppNotificationService;
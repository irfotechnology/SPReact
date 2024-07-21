

export interface IAppNotificationService {
    postToastMessage(message:string):void;
    showAppMessage(message:string, messageType:number):void;
    isLoading(value:boolean):void;
}
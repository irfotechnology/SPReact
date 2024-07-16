import { IFileAddResult, IWeb, Web } from "@pnp/sp/presets/all";
import deployment_config from "./deployment.config";
import buildTree, { TreeNode } from "./buildtree";
const JSZip = require('jszip');

export interface IAppManifest {
    id: string;
    name: string;
    version: string;
    description: string;
    publisher: string;
}

export interface IAppPack {
    Id: number;
    appTitle: string;
    appId: string;
    appVersion: string;
    description: string;
    publisher: string;
    validAppPackage: boolean;
    deployed?: boolean;
    deployedBy?: number | null;
    deployedOn?: Date | null;
    hostSPSite?: string;
    appPackageErrorMessage?: string
}

//
export default class deploymentJob {

    private _spBaseUrl = '';
    private zipContents: any = null;
    private _appCatalogUrl = '';
    private deploymentConfig: {
        tanentPath: string;
        cdnPath: string;
        tempPath: string;
        appCatlogPath: string;
        appCatlogTitle: string;
    }

    public constructor(baseUrl: string, appCatalogUrl: string) {
        this._spBaseUrl = baseUrl;
        this._appCatalogUrl = appCatalogUrl;
        this.deploymentConfig = (new deployment_config()).getConfig(baseUrl);
    }

    // private getFileName(filePath: string) {
    //     return filePath.length > 0 ? filePath.substring(filePath.lastIndexOf("/") + 1) : '';
    // }

    public deleteAppFolder(appId: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const __web = Web(this._spBaseUrl);
                await __web.getFolderByServerRelativeUrl(this.deploymentConfig.cdnPath + '/' + appId).delete();
                resolve(true);
            }
            catch (ex) {
                reject(ex);
            }
        });
    }

    private resetTempFolder(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const __web = Web(this._spBaseUrl);
                let __tmpfolder = null;
                try {
                    __tmpfolder = await __web.getFolderByServerRelativeUrl(this.deploymentConfig.tempPath).get();
                }
                catch {
                }
                if (__tmpfolder != null) {
                    await __web.getFolderByServerRelativeUrl(this.deploymentConfig.tempPath).delete();
                }
                await __web.getFolderByServerRelativeUrl(this.deploymentConfig.cdnPath).addSubFolderUsingPath('Temp');
                resolve(true);
            }
            catch (ex) {
                reject(ex);
            }
        });
    }

    // private copyAppPackage(appPackagePath: string): Promise<boolean> {
    //     return new Promise<boolean>(async (resolve, reject) => {
    //         try {
    //             const __web = Web(this._appCatalogUrl);
    //             await __web.getFileByUrl(appPackagePath).copyByPath(this.deploymentConfig.tanentPath.substring(0, this.deploymentConfig.tanentPath.length - 1) + this.deploymentConfig.tempPath + "/" + this.getFileName(appPackagePath), true, true);
    //             resolve(true);
    //         }
    //         catch (ex) {
    //             reject(ex);
    //         }
    //     });
    // }

    public loadAppPackage(appPackagePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.resetTempFolder().then(async (v) => {
                // this.copyAppPackage(appPackagePath).then(async (a) => {
                const zipfile = this.deploymentConfig.tanentPath.substring(0, this.deploymentConfig.tanentPath.length - 1) + appPackagePath;
                const __web = Web(this._appCatalogUrl);
                const __file = await __web.getFileByUrl(zipfile).getBlob();
                JSZip.loadAsync(__file).then(async (contents: any) => {
                    this.zipContents = contents;
                    resolve(true);
                }).catch((error: any) => {
                    console.log(error);
                    reject(error);
                });
                // }).catch((err1: any) => {
                //     console.log(err1);
                //     reject(err1);
                // });
            }).catch((err: any) => {
                console.log(err);
                reject(err);
            });
        });
    }

    public getAppManifestInfo(): Promise<IAppManifest> {
        return new Promise<IAppManifest>((resolve, reject) => {
            this.zipContents.file('appManifest.json').async('string').then((__appManifestContent: string) => {
                const __appManifest: IAppManifest = JSON.parse(__appManifestContent);
                resolve(__appManifest);
            }).catch((error: any) => {
                console.log(error);
                reject(error);
            });
        });
    }

    public checkIfAppExist(appId: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const __web = Web(this._spBaseUrl);
                const __fld = await __web.getFolderByServerRelativeUrl(this.deploymentConfig.cdnPath + '/' + appId).get();
                resolve(__fld.Exists);
            }
            catch (ex) {
                resolve(false);
            }
        });
    }

    public getDeployedAppManifestInfo(appId: string): Promise<IAppManifest> {
        return new Promise<IAppManifest>((resolve, reject) => {
            const __web = Web(this._spBaseUrl);
            __web.getFileByServerRelativeUrl(this.deploymentConfig.cdnPath + '/' + appId + '/appManifest.json').getJSON().then((__appManifest: IAppManifest) => {
                resolve(__appManifest);
            }).catch((error: any) => {
                console.log(error);
                reject(error);
            });
        });
    }

    private async _createFolders(web: IWeb, tempPath: string, rootPath: string, folder: TreeNode, callbackProgress: (folderName: string) => void): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            web.getFolderByServerRelativeUrl(tempPath + "/" + rootPath).folders.add(folder.name).then((v) => {
                callbackProgress(folder.name);
                if (folder.children.length > 0) {
                    const __promises: Promise<boolean>[] = [];
                    folder.children.forEach((f) => {
                        __promises.push(this._createFolders(web, tempPath, rootPath + "/" + folder.name, f, callbackProgress));
                    });
                    Promise.all(__promises).then((v) => {
                        resolve(true);
                    }).catch((e) => {
                        console.log(e);
                        reject(e);
                    });
                }
                else {
                    resolve(true);
                }
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    public createFolders(appId: string, callbackProgress: (folderName: string) => void): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                //delete app folder 
                await this.deleteAppFolder(appId);
                //first create folders
                const __folders: string[][] = [];
                const __content = this.zipContents;
                Object.keys(__content.files).forEach(function (filename) {
                    if (__content.files[filename].dir) {
                        let dirPath: string = __content.files[filename].name;
                        __folders.push(dirPath.split('/').filter(a => a != ''));
                    }
                });
                const __web = Web(this._spBaseUrl);
                const ret = await this._createFolders(__web, this.deploymentConfig.cdnPath, '', buildTree(appId, __folders), callbackProgress);
                resolve(ret);
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    public uploadFiles(appId: string, callbackProgress: (fileName: string) => void): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                const __promiseFiles: Promise<IFileAddResult>[] = [];
                const __web = Web(this._spBaseUrl);
                const __folder = this.deploymentConfig.cdnPath + "/" + appId;
                const __tempfolder = this.deploymentConfig.tempPath;
                const __content = this.zipContents;
                const __allitems = Object.keys(__content.files);
                for (var i = 0; i < __allitems.length; i++) {
                    var filename = __allitems[i]
                    if (__content.files[filename].dir == false) {
                        const __fileContent = await __content.file(filename).async('nodebuffer')
                        const filePath: string = __content.files[filename].name;
                        const fname: string = filePath.length > 0 ? filePath.substring(filePath.lastIndexOf("/") + 1) : '';
                        const dirPath: string = filePath.indexOf("/") > -1 ? filePath.replace(fname, '') : "";
                        const __ret = __web.getFolderByServerRelativeUrl(__folder + '/' + dirPath).files.add(fname, __fileContent, true);
                        __promiseFiles.push(__ret);
                        await callbackProgress(fname);
                    }
                }
                Promise.all(__promiseFiles).then((v) => {
                    __web.getFolderByServerRelativeUrl(__tempfolder).delete().then((v) => {
                        resolve(true);
                    });
                });
            } catch (error) {
                reject(reject);
            }
        });
    }

    public formatDate(d: Date) {
        var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        var hours = d.getHours();
        var minutes = d.getMinutes();

        return [year, month, day].join('-') + "T" + hours + ":" + minutes + ":00Z";
    }

    public updateDeploymentStatus(appPack: IAppPack): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const __web = Web(this._appCatalogUrl);
            __web.lists.getByTitle('Apps for SPReact').items.getById(appPack.Id).update({
                AppTitle: appPack.appTitle,
                AppID: appPack.appId,
                AppVersion: appPack.appVersion,
                Description: appPack.description,
                Publisher: appPack.publisher,
                ValidApp: appPack.validAppPackage,
                Deployed: appPack.deployed,
                DeployedById: appPack.deployedBy,
                DeployedOn: appPack.deployedOn,
                HostSPSite: appPack.hostSPSite,
                AppError: appPack.appPackageErrorMessage
            }).then((v) => {
                resolve(true);
            }).catch((err) => {
                reject(err);
            })
        });
    }
}
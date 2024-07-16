import { Log } from '@microsoft/sp-core-library';
import { sp } from '@pnp/sp';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetExecuteEventParameters,
  ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import deploymentJob from './deploymentJob';
import { Dialog } from '@microsoft/sp-dialog';
import ProgressDialog from './ProgressDialog';
import ConfirmDialog from './ConfirmDialog';


/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpreactAppDeployCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'SpreactAppDeployCommandSet';

export default class SpreactAppDeployCommandSet extends BaseListViewCommandSet<ISpreactAppDeployCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized SpreactAppDeployCommandSet');
    sp.setup({ pageContext: this.context.pageContext });
    // initial state of the command's visibility
    const compareOneCommand1: Command = this.tryGetCommand('COMMAND_1');
    compareOneCommand1.visible = false;
    const compareOneCommand2: Command = this.tryGetCommand('COMMAND_2');
    compareOneCommand2.visible = false;
    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

  public async onExecute(event: IListViewCommandSetExecuteEventParameters): Promise<void> {
    switch (event.itemId) {
      case 'COMMAND_1':
        console.log('Deploying app....');     
        const __user = await sp.web.currentUser.get();
        const __Id: string = event.selectedRows[0].getValueByName("ID");
        const __fileName: string = event.selectedRows[0].getValueByName("FileLeafRef");
        const __filePath = event.selectedRows[0].getValueByName("FileRef");
        const __spTenant = `https://${window.location.host}/`
        const _progressDialog = new ProgressDialog();
        const __window = await _progressDialog.Open();
        const __selectedSite = await __window.PromptForSite();
        if (__selectedSite == '') {
          await _progressDialog.Close();
          return Promise.resolve();
        }
        try {
          const __deploymentJob = new deploymentJob(__spTenant, this.context.pageContext.site.absoluteUrl);
          __deploymentJob.loadAppPackage(__filePath).then(async (v) => {
            __window.UpdateProgress(`loading app package ... ${__filePath}`, 0.1);
            const __appInfo = await __deploymentJob.getAppManifestInfo();
            const __appExist = await __deploymentJob.checkIfAppExist(__appInfo.id);
            let __confirmMessage = `Are you sure, you would like to deploy application package ${__fileName} ?`
            if (__appExist) {
              const __oldAppInfo = await __deploymentJob.getDeployedAppManifestInfo(__appInfo.id);
              __confirmMessage = `Application ${__oldAppInfo.name} - ${__oldAppInfo.version} already exists, Do you want to overwrite and deploy version - ${__appInfo.version} ?`
            }
            const __isConfirmed = await __window.ShowConfirm(__confirmMessage);
            if (__isConfirmed) {
              __window.UpdateProgress('creating folders...', 0.2);
              let __progress = 0;
              __deploymentJob.createFolders(__appInfo.id, (folder) => {
                __progress += 1;
                __window.UpdateProgress(`creating folders... ${folder}`, 0.2 + __progress / 100);
              }).then((v) => {
                if (v) {
                  __deploymentJob.uploadFiles(__appInfo.id, (file) => {
                    return new Promise<void>((resolve,reject)=>{
                      __progress += 1;
                      __window.UpdateProgress(`uploading files... ${file}`, 0.5 + __progress / 100);
                      resolve();
                    });
                  }).then(async (v) => {
                    __deploymentJob.updateDeploymentStatus({
                      Id: Number(__Id),
                      appId: __appInfo.id,
                      appTitle: __appInfo.name,
                      appVersion: __appInfo.version,
                      description: __appInfo.description,
                      publisher: __appInfo.publisher,
                      validAppPackage: true,
                      deployed: true,
                      deployedBy : __user.Id,
                      deployedOn: (new Date()),
                      hostSPSite: __selectedSite,
                      appPackageErrorMessage:''
                    });
                    await __window.ShowAlert("Application package has been deployed successfully.");
                    await _progressDialog.Close();
                    return Promise.resolve();
                  }).catch(async (err) => {
                    __deploymentJob.updateDeploymentStatus({
                      Id: Number(__Id),
                      appId: __appInfo.id,
                      appTitle: __appInfo.name,
                      appVersion: __appInfo.version,
                      description: __appInfo.description,
                      publisher: __appInfo.publisher,
                      validAppPackage: true,
                      deployed: false,
                      deployedBy : null,
                      deployedOn: null,
                      hostSPSite: '',
                      appPackageErrorMessage: `Error in creating files... ${err}`
                    });
                    await __window.ShowAlert(`Error in creating files... ${err}`);
                    await _progressDialog.Close();
                    return Promise.resolve();
                  });
                }
              }).catch(async (error) => {
                await __deploymentJob.updateDeploymentStatus({
                  Id: Number(__Id),
                  appId: __appInfo.id,
                  appTitle: __appInfo.name,
                  appVersion: __appInfo.version,
                  description: __appInfo.description,
                  publisher: __appInfo.publisher,
                  validAppPackage: true,
                  deployed: false,
                  deployedBy : null,
                  deployedOn: null,
                  hostSPSite: '',
                  appPackageErrorMessage: `Error in creating folders... ${error}`
                });
                await __window.ShowAlert(`Error in creating folders... ${error}`);
                await _progressDialog.Close();
                return Promise.resolve();
              });
            }
            else {
              await _progressDialog.Close();
              return Promise.resolve();
            }
          }).catch(async (err) => {
            await __deploymentJob.updateDeploymentStatus({
              Id: Number(__Id),
              appId: '',
              appTitle: '',
              appVersion: '',
              description:'',
              publisher:'',
              deployed: false,
              validAppPackage: false,
              deployedBy: null,
              deployedOn: null,
              hostSPSite: '',
              appPackageErrorMessage: `Invalid application package : ${err}`
            });
            await __window.ShowAlert(`Error in loading app pakckage... ${err}`)
            await _progressDialog.Close();
            return Promise.resolve();
          });
        }
        catch (error) {
          console.log(error);
          await __window.ShowAlert(`Error in loading app pakckage... ${error}`)
          await _progressDialog.Close();
          return Promise.resolve();
        }
        break;
      case 'COMMAND_2':
        console.log('Removing app....');
        const id: string = event.selectedRows[0].getValueByName("ID");
        const file: string = event.selectedRows[0].getValueByName("FileLeafRef");
        const filePath: string = event.selectedRows[0].getValueByName("FileRef");
        let __confirmMessage = `Are you sure, you would like to remove application ${file} ?`
        const confirm = await this.showConfirm(__confirmMessage);
        if (confirm) {
          const __spTenant = `https://${window.location.host}/`
          try {
            const __deploymentJob = new deploymentJob(__spTenant, this.context.pageContext.site.absoluteUrl);
            __deploymentJob.loadAppPackage(filePath).then(async (v) => {
              const __appInfo = await __deploymentJob.getAppManifestInfo();
              const __appExist = await __deploymentJob.checkIfAppExist(__appInfo.id);
              if (__appExist) {
                await __deploymentJob.deleteAppFolder(__appInfo.id);
                await __deploymentJob.updateDeploymentStatus({
                  Id: Number(id),
                  appId: __appInfo.id,
                  appTitle: __appInfo.name,
                  appVersion: __appInfo.version,
                  description: __appInfo.description,
                  publisher : __appInfo.publisher,
                  deployedBy: null,
                  validAppPackage: true,
                  deployed: false,
                  appPackageErrorMessage: '',
                  hostSPSite: '',
                  deployedOn: null
                });
                await Dialog.alert(`The application ${__appInfo.name} has been removed successfully.`);
                return Promise.resolve();
              }
              else {
                await Dialog.alert(`The application ${__appInfo.name} is not deployed yet.`);
                return Promise.resolve();
              }
            }).catch(async (err) => {
              await Dialog.alert(err.toString());
              return Promise.resolve();
            });
          }
          catch (error) {
            console.log(error);
            await Dialog.alert(error.toString());
            return Promise.resolve();
          }
        }
        break;
      default:
        throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const compareOneCommand1: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand1) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand1.visible = this.context.listView.list?.title == 'App for SPReact';
      compareOneCommand1.visible = this.context.listView.selectedRows?.length === 1;
      if (this.context.listView.selectedRows?.length == 1) {
        compareOneCommand1.visible = (this.context.listView.selectedRows[0].getValueByName("FileLeafRef") + "").lastIndexOf(".appkg") > -1
      }
    }

    const compareOneCommand2: Command = this.tryGetCommand('COMMAND_2');
    if (compareOneCommand2) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand2.visible = this.context.listView.selectedRows?.length === 1;
      if (this.context.listView.selectedRows?.length == 1) {
        compareOneCommand2.visible = (this.context.listView.selectedRows[0].getValueByName("FileLeafRef") + "").lastIndexOf(".appkg") > -1
      }
    }

    // TODO: Add your logic here

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }

  public showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const __confirmDialog = new ConfirmDialog(message, () => {
        resolve(true);
      }, () => {
        resolve(false);
      });
      __confirmDialog.show();
    });
  }

}

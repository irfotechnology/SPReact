import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { DefaultButton, DialogContent, DialogFooter, Label, PrimaryButton, ProgressIndicator, Stack, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styles from './AppStyles.module.scss'
const _icon = require('./../../../dist/react_logo.svg');

export interface IProgresssDialogProps {
    progress: number;
    message: string;
    onload: any;
    parent: any;
}


class ProgressDialogComponent extends
    React.Component<IProgresssDialogProps, {}> {

    private _progress: number;
    private _message: string;
    public Parent: any;
    private _promptForSite: boolean;
    private _hostSite: string | undefined;
    private onSiteSelected: any;
    private onSiteSelectionCancelled: any;
    private _showConfirm: boolean;
    private onConfirm?: any;
    private onCancel?: any;
    private onOKClick?: any;
    private _showAlert: boolean;

    public constructor(props: IProgresssDialogProps) {
        super(props);
        this._message = props.message;
        this._progress = props.progress;
        this.Parent = props.parent;
    }

    public componentDidMount(): void {
        this.props.onload(this);
    }

    public render(): JSX.Element {
        return (<div style={{ width: 600, height: this._promptForSite ? 96 : 140, padding: 40 }}>
            {this._showAlert ?
                <div>
                    <DialogContent
                        title="Alert"
                        onDismiss={this.onOKClick}>
                        <div style={{ marginBottom: 20 }} >{this._message}</div>
                        <DialogFooter>
                            <PrimaryButton text="OK"
                                title="Close" onClick={this.onOKClick} />
                        </DialogFooter>
                    </DialogContent>
                </div>
                : this._showConfirm ?
                    <div>
                        <DialogContent
                            title="Please Confirm"
                            onDismiss={this.onCancel}>
                            <div style={{ marginBottom: 20 }} >{this._message}</div>
                            <DialogFooter>
                                <DefaultButton text="Yes"
                                    title="Close" onClick={this.onConfirm} />
                                <DefaultButton text="Cancel"
                                    title="Close" onClick={this.onCancel} />
                            </DialogFooter>
                        </DialogContent>
                    </div> : (this._promptForSite ?
                        <>
                            <Stack horizontal gap={20}>
                                <Label>SharePoint Site:</Label>
                                <TextField description={`Enter link of the SharePoint Site where you would like to deploy this app.`} styles={{ root: { width: '100%', minWidth: '220px' } }} onChange={(e, v) => {
                                    this._hostSite = v;
                                    e.preventDefault();
                                    this.setState({ hostSite: this._hostSite });
                                }}></TextField>
                            </Stack>
                            <Stack style={{ marginTop: 20 }} horizontalAlign='end' horizontal gap={20}>
                                <PrimaryButton disabled={this._hostSite == null} onClick={this.onSiteSelected}>OK</PrimaryButton>
                                <DefaultButton onClick={this.onSiteSelectionCancelled}>Cancel</DefaultButton>
                            </Stack>
                        </>
                        :
                        <>
                            <div className={styles.ApplogoContainer} ><img src={_icon} className={styles.Applogo} alt="logo"></img></div>
                            <ProgressIndicator description={this._message} percentComplete={this._progress}></ProgressIndicator>
                        </>)}
        </div>);
    }

    public UpdateProgress(message: string, progress: number) {
        this._promptForSite = false;
        this._showAlert = false;
        this._showConfirm = false;
        this._message = message;
        this._progress = progress;
        this.setState({ message: message, progress: progress });
    }

    public PromptForSite(): Promise<string | undefined> {
        return new Promise<string | undefined>((resolve, reject) => {
            this.onSiteSelected = (() => {
                this._promptForSite = false;
                this.setState({ promptForSite: this._promptForSite });
                resolve(this._hostSite);
            });
            this.onSiteSelectionCancelled = (() => {
                this._promptForSite = false;
                this.setState({ promptForSite: this._promptForSite });
                resolve('');
            });
            this._hostSite = "";
            this._promptForSite = true;
            this._showAlert = false;
            this._showConfirm = false;
            this.setState({ promptForSite: this._promptForSite });
        });
    }

    public ShowConfirm(message: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._message = message;
            this.onConfirm = (() => {
                this._message = "";
                this._showConfirm = false;
                this.setState({ showConfirm: this._showConfirm });
                resolve(true);
            });
            this.onCancel = (() => {
                this._message = "";
                this._showConfirm = false;
                this.setState({ showConfirm: this._showConfirm });
                resolve(false);
            });
            this._showConfirm = true;
            this._promptForSite = false;
            this._showAlert = false;
            this.setState({ showConfirm: this._showConfirm });
        });
    }

    public ShowAlert(message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this._message = message;
            this.onOKClick = (() => {
                this._message = "";
                this._showAlert = false;
                this.setState({ showAlert: this._showAlert });
                resolve();
            });
            this._showAlert = true;
            this._promptForSite = false;
            this._showConfirm = false;
            this.setState({ showAlert: this._showAlert });
        });
    }

}

export default class ProgressDialog extends BaseDialog {

    /**
     * Constructor for the dialog window
     */
    constructor() {
        super({ isBlocking: true });
    }

    private _message: string = "";
    private _progress: number = 0;
    private _onWindowLoad: any;
    public progressWindow: ProgressDialogComponent;

    public render(): void {
        ReactDOM.render(<ProgressDialogComponent
            message={this._message}
            progress={this._progress}
            onload={this._onWindowLoad}
            parent={this}
        />, this.domElement);
    }

    public getConfig(): IDialogConfiguration {
        return {
            isBlocking: true
        };
    }

    public async Close(): Promise<void> {
        ReactDOM.unmountComponentAtNode(this.domElement);
        await this.close();
    }

    public Open(): Promise<ProgressDialogComponent> {
        this.show();
        return new Promise<ProgressDialogComponent>((resolve, reject) => {
            this._onWindowLoad = ((progressWindow: ProgressDialogComponent) => {
                resolve(progressWindow);
            });
        });
    }
}
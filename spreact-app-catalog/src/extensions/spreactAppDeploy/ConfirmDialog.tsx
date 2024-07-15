import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import {
    DefaultButton,
    DialogFooter,
    DialogContent
} from 'office-ui-fabric-react';

// import { File } from '@microsoft/mgt-react/dist/es6/spfx';

export interface IConfigDialogProps {
    onConfirm: any;
    onCancel: any;
    message: string;
}

class ConfirmDialogComponent extends
    React.Component<IConfigDialogProps, {}> {

    public render(): JSX.Element {
        return <div>
            <DialogContent
                title="Please Confirm"
                onDismiss={this.props.onCancel}>
                <div>{this.props.message}</div>
                <DialogFooter>
                    <DefaultButton text="Yes"
                        title="Close" onClick={this.props.onConfirm} />
                    <DefaultButton text="Cancel"
                        title="Close" onClick={this.props.onCancel} />
                </DialogFooter>
            </DialogContent>
        </div>;
    }
}

export default class ConfirmDialog extends BaseDialog {

    /**
     * Constructor for the dialog window
     */
    constructor(message: string, onConfirm: any, onCancel: any) {
        super({ isBlocking: true });
        this._message = message;
        this._confirm = onConfirm;
        this._cancel = onCancel;
    }

    private _message: string = "";
    private _confirm: any;
    private _cancel: any;

    public render(): void {
        ReactDOM.render(<ConfirmDialogComponent
            message={this._message}
            onConfirm={() => {
                this._confirm();
                this._close();
            }}
            onCancel={() => {
                this._cancel();
                this._close();
            }}
        />, this.domElement);
    }

    public getConfig(): IDialogConfiguration {
        return {
            isBlocking: true
        };
    }

    private _close = async (): Promise<void> => {
        ReactDOM.unmountComponentAtNode(this.domElement);
        await this.close();
    }

}
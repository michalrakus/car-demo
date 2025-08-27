import {XInputText} from "@michalrakus/x-react-web-lib/XInputText";
import {SourceCodeLinkForm} from "./SourceCodeLinkForm";
import {SourceCodeLinkEntity} from "./SourceCodeLinkEntity";
import {XInputDecimal} from "@michalrakus/x-react-web-lib/XInputDecimal";
import {XUtils} from "@michalrakus/x-react-web-lib/XUtils";
import {XFormFooter} from "@michalrakus/x-react-web-lib/XFormFooter";
import {XFormHeader} from "@michalrakus/x-react-web-lib/XFormHeader";
import {XFormBaseModif} from "@michalrakus/x-react-web-lib/XFormBaseModif";
import type {XObject} from "@michalrakus/x-react-web-lib/XObject";
import {XInputDate} from "@michalrakus/x-react-web-lib/XInputDate";
import {type XFormProps} from "@michalrakus/x-react-web-lib/XFormBase";

export class ClientForm extends XFormBaseModif {

    constructor(props: XFormProps) {
        super(props, "Client");
    }

    createNewObject(): XObject {
        return {version: 0};
    }

    render() {
        return (
            <div>
                <XFormHeader form={this} label="Client"/>
                <div className="x-form-row">
                    <div className="x-form-col">
                        <XInputDecimal form={this} field="id" label="ID" readOnly={true}/>
                        <XInputText form={this} field="name" label="Name"/>
                        <XInputDate form={this} field="birthDate" label="Birth date"/>
                        <XInputText form={this} field="contact" label="Contact"/>
                        <XInputText form={this} field="address" label="Address" inputStyle={{width:'25rem'}}/>
                        <XInputDate form={this} field="modifDate" label="Modified at" readOnly={true}/>
                        <XInputText form={this} field="modifXUser.name" label="Modified by" readOnly={true} inputStyle={{width: '12.5rem'}}/>
                    </div>
                </div>
                <XFormFooter form={this}/>
                <SourceCodeLinkForm sourceCodeFile="ClientForm.tsx"/>
                <SourceCodeLinkEntity sourceCodeFile="client.entity.ts"/>
            </div>
        );
    }
}

(ClientForm as any).assocList = (): string[] => {
    return ["modifXUser"];
}

// registration is used if user opens form from editable Browse saved in DB
XUtils.registerAppForm(<ClientForm/>, "Client");

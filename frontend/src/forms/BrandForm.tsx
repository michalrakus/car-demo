import React from "react";
import {XInputText} from "@michalrakus/x-react-web-lib/XInputText";
import {SourceCodeLinkForm} from "./SourceCodeLinkForm";
import {SourceCodeLinkEntity} from "./SourceCodeLinkEntity";
import {XFormBase} from "@michalrakus/x-react-web-lib/XFormBase";
import {Form} from "../XLibItems";
import {XInputDecimal} from "@michalrakus/x-react-web-lib/XInputDecimal";
import {XUtils} from "@michalrakus/x-react-web-lib/XUtils";
import {XFormFooter} from "@michalrakus/x-react-web-lib/XFormFooter";
import {XFormHeader} from "@michalrakus/x-react-web-lib/XFormHeader";

@Form("Brand")
export class BrandForm extends XFormBase {

    render() {
        return (
            <div>
                <XFormHeader form={this} label="Brand"/>
                <div className="x-form-row">
                    <div className="x-form-col">
                        <XInputDecimal form={this} field="id" label="ID" readOnly={true}/>
                        <XInputText form={this} field="brand" label="Brand"/>
                    </div>
                </div>
                <XFormFooter form={this}/>
                <SourceCodeLinkForm sourceCodeFile="BrandForm.tsx"/>
                <SourceCodeLinkEntity sourceCodeFile="brand.entity.ts"/>
            </div>
        );
    }
}

// registration is used if user opens form from editable Browse saved in DB
XUtils.registerAppForm(<BrandForm/>, "Brand");

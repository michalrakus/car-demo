import {XInputText} from "@michalrakus/x-react-web-lib/XInputText";
import {SourceCodeLinkForm} from "./SourceCodeLinkForm";
import {SourceCodeLinkEntity} from "./SourceCodeLinkEntity";
import {XFormBase, type XFormProps} from "@michalrakus/x-react-web-lib/XFormBase";
import {XInputDecimal} from "@michalrakus/x-react-web-lib/XInputDecimal";
import {XUtils} from "@michalrakus/x-react-web-lib/XUtils";
import {XFormFooter} from "@michalrakus/x-react-web-lib/XFormFooter";
import {XFormHeader} from "@michalrakus/x-react-web-lib/XFormHeader";

export class BrandForm extends XFormBase {

    constructor(props: XFormProps) {
        super(props, "Brand");
    }

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

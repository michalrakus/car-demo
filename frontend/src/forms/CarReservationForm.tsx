import React from "react";
import {XInputText} from "@michalrakus/x-react-web-lib/XInputText";
import {SourceCodeLinkForm} from "./SourceCodeLinkForm";
import {SourceCodeLinkEntity} from "./SourceCodeLinkEntity";
import {Form} from "../XLibItems";
import {XInputDecimal} from "@michalrakus/x-react-web-lib/XInputDecimal";
import {XUtils} from "@michalrakus/x-react-web-lib/XUtils";
import {XFormFooter} from "@michalrakus/x-react-web-lib/XFormFooter";
import {XFormHeader} from "@michalrakus/x-react-web-lib/XFormHeader";
import {XFormBaseModif} from "@michalrakus/x-react-web-lib/XFormBaseModif";
import {XObject} from "@michalrakus/x-react-web-lib/lib/components/XObject";
import {XInputTextarea} from "@michalrakus/x-react-web-lib/XInputTextarea";
import {XInputDate} from "@michalrakus/x-react-web-lib/XInputDate";
import {XAutoComplete} from "@michalrakus/x-react-web-lib/XAutoComplete";
import {ClientBrowse} from "./ClientBrowse";
import {ClientForm} from "./ClientForm";
import {CarBrowse} from "./CarBrowse";
import {CarForm} from "./CarForm";
import type {XFormProps} from "@michalrakus/x-react-web-lib/XFormBase";

@Form("CarReservation")
export class CarReservationForm extends XFormBaseModif {

    constructor(props: XFormProps) {
        super(props);

        // row Brand (used in XAutoComplete for Car) is not joined automatically
        this.addField("car.brandAssoc.brand");
    }

    createNewObject(): XObject {
        return {version: 0};
    }

    render() {
        return (
            <div>
                <XFormHeader form={this} label="Car reservation"/>
                <div className="x-form-row">
                    <div className="x-form-col">
                        <XInputDecimal form={this} field="id" label="ID" readOnly={true}/>
                        <XAutoComplete form={this} assocField="client" label="Client" width="30rem"
                                       displayField={["name", "birthDate", "address"]} sortField="name" scrollHeight="25rem"
                                       suggestionsLoad="lazy"
                                       searchBrowse={<ClientBrowse/>} assocForm={<ClientForm/>}
                        />
                        <XInputDate form={this} field="dateFrom" label="Date from"/>
                        <XInputDate form={this} field="dateTo" label="Date to"/>
                        <XAutoComplete form={this} assocField="car" label="Car"
                                       displayField={["id", "brandAssoc.brand", "color"]} scrollHeight="25rem"
                                       suggestionsLoad="lazy"
                                       searchBrowse={<CarBrowse/>} assocForm={<CarForm/>}/>
                        <XInputDecimal form={this} field="price" label="Price"/>
                        <XInputTextarea form={this} field="comment" label="Comment" rows={2} autoResize={true}/>
                        <XInputDate form={this} field="modifDate" label="Modified at" readOnly={true}/>
                        <XInputText form={this} field="modifXUser.name" label="Modified by" readOnly={true} inputStyle={{width: '12.5rem'}}/>
                    </div>
                </div>
                <XFormFooter form={this}/>
                <SourceCodeLinkForm sourceCodeFile="CarReservationForm.tsx"/>
                <SourceCodeLinkEntity sourceCodeFile="car-reservation.entity.ts"/>
            </div>
        );
    }
}

// registration is used if user opens form from editable Browse saved in DB
XUtils.registerAppForm(<CarReservationForm/>, "CarReservation");

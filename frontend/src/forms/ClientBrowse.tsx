import React from "react";
import {
    XBrowseProps,
    XLazyColumn,
    XLazyDataTable,
    XSearchBrowseProps
} from "@michalrakus/x-react-web-lib/XLazyDataTable";
import {SourceCodeLinkForm} from "./SourceCodeLinkForm";
import {SourceCodeLinkEntity} from "./SourceCodeLinkEntity";
import {ClientForm} from "./ClientForm";
import {Client} from "../model/client.entity";

export const ClientBrowse = (props: XBrowseProps & XSearchBrowseProps) => {

    const onAddRow = () => {

        // openForm is added automatically in XFormNavigator3
        props.openForm!(<ClientForm/>);
    }

    const onEdit = (selectedRow: Client) => {

        // openForm is added automatically in XFormNavigator3
        props.openForm!(<ClientForm id={selectedRow.id}/>);
    }

    return (
        <div>
            <XLazyDataTable entity="Client" label="Clients" rows={30} formFooterHeight={'4.43rem'}
                            onAddRow={onAddRow} onEdit={onEdit} removeRow={true}
                            displayed={props.displayed} searchBrowseParams={props.searchBrowseParams}>
                <XLazyColumn field="id" header="ID" width="5rem"/>
                <XLazyColumn field="name" header="Name" width="15rem"/>
                <XLazyColumn field="birthDate" header="Birth date"/>
                <XLazyColumn field="contact" header="Contact" width="10rem"/>
            </XLazyDataTable>
            <SourceCodeLinkForm sourceCodeFile="ClientBrowse.tsx"/>
            <SourceCodeLinkEntity sourceCodeFile="client.entity.ts"/>
        </div>
    );
}

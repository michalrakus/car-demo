import React from "react";
import {
    XBrowseProps,
    XLazyColumn,
    XLazyDataTable,
    XSearchBrowseProps
} from "@michalrakus/x-react-web-lib/XLazyDataTable";
import {CarForm} from "./CarForm";
import {SourceCodeLinkForm} from "./SourceCodeLinkForm";
import {SourceCodeLinkEntity} from "./SourceCodeLinkEntity";

export const CarBrowse = (props: XBrowseProps & XSearchBrowseProps) => {

    const onAddRow = () => {

        // openForm is added automatically in XFormNavigator3
        (props as any).openForm(<CarForm/>);
    }

    const onEdit = (selectedRow: any) => {

        // openForm is added automatically in XFormNavigator3
        (props as any).openForm(<CarForm id={selectedRow.id}/>);
    }

    return (
        <div>
            <XLazyDataTable entity="Car" label="Cars" rows={30} formFooterHeight={'4.43rem'} sortField="id"
                            onAddRow={onAddRow} onEdit={onEdit} removeRow={true}
                            displayed={props.displayed} searchBrowseParams={props.searchBrowseParams}>
                <XLazyColumn field="id" header="ID" width="5rem"/>
                <XLazyColumn field="vin" header="Vin" width="7rem"/>
                <XLazyColumn field="year" header="Year"/>
                <XLazyColumn field="brandString" header="Brand string" width="8rem"/>
                <XLazyColumn field="brandAssoc.brand" header="Brand assoc" dropdownInFilter={true} width="8rem"/>
                <XLazyColumn field="color" header="Color" width="7rem"/>
                <XLazyColumn field="price" header="Price"/>
                <XLazyColumn field="carDate" header="Car Date"/>
                <XLazyColumn field="carDatetime" header="Car Datetime"/>
                <XLazyColumn field="carBoolean" header="Car Boolean"/>
            </XLazyDataTable>
            <SourceCodeLinkForm sourceCodeFile="CarBrowse.tsx"/>
            <SourceCodeLinkEntity sourceCodeFile="car.entity.ts"/>
        </div>
    );
}

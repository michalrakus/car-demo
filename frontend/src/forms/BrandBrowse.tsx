import React from "react";
import {
    XBrowseProps,
    XLazyColumn,
    XLazyDataTable,
    XSearchBrowseProps
} from "@michalrakus/x-react-web-lib/XLazyDataTable";
import {BrandForm} from "./BrandForm";
import {SourceCodeLinkForm} from "./SourceCodeLinkForm";
import {SourceCodeLinkEntity} from "./SourceCodeLinkEntity";

export const BrandBrowse = (props: XBrowseProps & XSearchBrowseProps) => {

    const onAddRow = () => {

        // openForm pridavame automaticky v XFormNavigator3 pri renderovani komponentu
        (props as any).openForm(<BrandForm/>);
    }

    const onEdit = (selectedRow: any) => {

        // openForm pridavame automaticky v XFormNavigator3 pri renderovani komponentu
        (props as any).openForm(<BrandForm id={selectedRow.id}/>);
    }

    return (
        <div>
            <XLazyDataTable entity="Brand" label="Brands" rows={30} formFooterHeight={'4.43rem'}
                            onAddRow={onAddRow} onEdit={onEdit} removeRow={true}
                            displayed={props.displayed} searchBrowseParams={props.searchBrowseParams}>
                <XLazyColumn field="id" header="ID" width="5rem"/>
                <XLazyColumn field="brand" header="Brand" width="15rem"/>
            </XLazyDataTable>
            <SourceCodeLinkForm sourceCodeFile="BrandBrowse.tsx"/>
            <SourceCodeLinkEntity sourceCodeFile="brand.entity.ts"/>
        </div>
    );
}

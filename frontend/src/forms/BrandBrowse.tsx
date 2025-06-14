import React from "react";
import {
    XLazyColumn,
    XLazyDataTable,
    XSearchBrowseProps
} from "@michalrakus/x-react-web-lib/XLazyDataTable";
import {BrandForm} from "./BrandForm";
import {SourceCodeLinkForm} from "./SourceCodeLinkForm";
import {SourceCodeLinkEntity} from "./SourceCodeLinkEntity";

export const BrandBrowse = (props: XSearchBrowseProps) => {

    return (
        <div>
            <XLazyDataTable entity="Brand" label="Brands" rows={30} formFooterHeight={'4.43rem'}
                            editForm={<BrandForm/>} removeRow={true}
                            searchBrowseParams={props.searchBrowseParams}>
                <XLazyColumn field="id" header="ID" width="5rem"/>
                <XLazyColumn field="brand" header="Brand" width="15rem"/>
            </XLazyDataTable>
            <SourceCodeLinkForm sourceCodeFile="BrandBrowse.tsx"/>
            <SourceCodeLinkEntity sourceCodeFile="brand.entity.ts"/>
        </div>
    );
}

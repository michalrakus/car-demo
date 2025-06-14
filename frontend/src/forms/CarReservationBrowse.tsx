import React from "react";
import {
    XLazyColumn,
    XLazyDataTable,
    XSearchBrowseProps
} from "@michalrakus/x-react-web-lib/XLazyDataTable";
import {SourceCodeLinkForm} from "./SourceCodeLinkForm";
import {SourceCodeLinkEntity} from "./SourceCodeLinkEntity";
import {CarReservationForm} from "./CarReservationForm";
import {ClientForm} from "./ClientForm";

export const CarReservationBrowse = (props: XSearchBrowseProps) => {

    return (
        <div>
            <XLazyDataTable entity="CarReservation" label="Car reservations" rows={30} formFooterHeight={'4.43rem'}
                            editForm={<CarReservationForm/>} removeRow={true}
                            searchBrowseParams={props.searchBrowseParams}>
                <XLazyColumn field="id" header="ID" width="5rem"/>
                <XLazyColumn field="client.name" header="Client" width="15rem"
                             autoFilter={true}
                             autoComplete={{
                                 assocField: "client", field: "name", valueForm: <ClientForm/>,
                                 lazyLoadMaxRows: 15, scrollHeight: "25rem"
                             }}/>
                <XLazyColumn field="dateFrom" header="Date from"/>
                <XLazyColumn field="dateTo" header="Date to"/>
                <XLazyColumn field="car.id" header="Car ID" width="5rem"/>
                <XLazyColumn field="car.brandAssoc.brand" header="Car brand" width="10rem"/>
                <XLazyColumn field="car.color" header="Car color" width="10rem"/>
                <XLazyColumn field="price" header="Price"/>
            </XLazyDataTable>
            <SourceCodeLinkForm sourceCodeFile="CarReservationBrowse.tsx"/>
            <SourceCodeLinkEntity sourceCodeFile="car-reservation.entity.ts"/>
        </div>
    );
}

import {Car} from "./car.entity";
import {Client} from "./client.entity";
import {XUser} from "@michalrakus/x-react-web-lib/lib/serverApi/XUser";

export interface CarReservation {
    id: number;
    dateFrom: Date | null;
    dateTo: Date | null;
    price: number | null;
    comment: string | null;
    car: Car;
    client: Client;

    // technical attributes
    modifDate: Date | null;
    modifXUser: XUser | null;
    version: number;
}

import type {Car} from "./car.entity";
import type {Client} from "./client.entity";
import type {XUser} from "@michalrakus/x-react-web-lib/XUser";

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

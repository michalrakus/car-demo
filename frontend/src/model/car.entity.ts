import {Brand} from "./brand.entity";
import {Ride} from "./ride.entity";
import {XUser} from "@michalrakus/x-react-web-lib/lib/serverApi/XUser";

export interface Car {
    id: number;
    vin: string;
    brandString: string | null;
    year: number | null;
    color: string | null;
    price: number | null;
    carDate: Date | null;
    carDatetime: Date | null;
    carBoolean: boolean;
    comment: string | null;
    brandAssoc: Brand | null;
    rideList: Ride[];

    // technical attributes
    modifDate: Date | null;
    modifXUser: XUser | null;
    version: number;
}

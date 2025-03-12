import {XUser} from "@michalrakus/x-react-web-lib/lib/serverApi/XUser";

export interface Client {
    id: number;
    name: string | null;
    birthDate: Date | null;
    contact: string | null;
    address: string | null;

    // technical attributes
    modifDate: Date | null;
    modifXUser: XUser | null;
    version: number;
}

import {Injectable} from '@nestjs/common';
import {DataSource} from "typeorm";
import {XLibService} from "@michalrakus/x-nest-server-lib/x-lib.service";
import {XFileService} from "@michalrakus/x-nest-server-lib/lib/services/x-file.service";
import {XEntityMetadataService} from "@michalrakus/x-nest-server-lib/lib/services/x-entity-metadata.service";
//import {UtilsCommon} from "@common/UtilsCommon";
//import {UtilsCommon} from "../../common/src/UtilsCommon";

@Injectable()
export class AppService {
    constructor(
        private dataSource: DataSource,
        private readonly xLibService: XLibService,
        private readonly xFileService: XFileService,
        private readonly xEntityMetadataService: XEntityMetadataService
    ) {
    }

    getHello(): string {
        //return 'car-demo-backend works 888!' + UtilsCommon.test();
        return 'car-demo-backend works 4!';
    }
}

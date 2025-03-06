import {Injectable} from '@nestjs/common';
import {DataSource} from "typeorm";
import {XLibService} from "@michalrakus/x-nest-server-lib/x-lib.service";
import {XFileService} from "@michalrakus/x-nest-server-lib/lib/services/x-file.service";
import {XEntityMetadataService} from "@michalrakus/x-nest-server-lib/lib/services/x-entity-metadata.service";

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
        return 'car-demo-backend works!';
    }
}

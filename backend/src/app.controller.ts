import {
    Body,
    Controller,
    Get,
    Post
} from '@nestjs/common';
import {AppService} from './app.service';
import {Public} from "@michalrakus/x-nest-server-lib/public";
import {FindParam} from "@michalrakus/x-nest-server-lib/lib/serverApi/FindParam";
import {FindResult} from "@michalrakus/x-nest-server-lib/lib/serverApi/FindResult";
import {XLazyDataTableService} from "@michalrakus/x-nest-server-lib/lib/services/x-lazy-data-table.service";
import {XLibService} from "@michalrakus/x-nest-server-lib/x-lib.service";
import {SaveRowParam} from "@michalrakus/x-nest-server-lib/lib/services/SaveRowParam";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService,
                private readonly xLazyDataTableService: XLazyDataTableService,
                private readonly xLibService: XLibService
                ) {
    }

    @Public()
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Public()
    @Post('lazyDataTableFindRowsTest')
    async lazyDataTableFindRowsTest(@Body() body: FindParam): Promise<FindResult> {
        const findResult: FindResult = await this.xLazyDataTableService.findRows(body);
        // test - typy atributov, ktore pouziva TypeORM pri nacitani objektu z DB
        for (const row of findResult.rowList) {
            //if (body.entity === "ZapisSocPorad") {
                for (const [key, value] of Object.entries(row)) {
                    console.log(`${key}: typeof = ${typeof value}, constructor name = ${value?.constructor?.name}, value = ${value}`);
                }
            //}
        }
        return findResult;
    }

    @Public()
    @Post('saveRowTest')
    saveRow(@Body() body: SaveRowParam): Promise<any> {
        return this.xLibService.saveRow(body);
    }
}

import {DynamicModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {XLibModule} from '@michalrakus/x-nest-server-lib/x-lib.module';
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {XBrowseMeta} from "@michalrakus/x-nest-server-lib/x-browse-meta.entity";
import {XColumnMeta} from "@michalrakus/x-nest-server-lib/x-column-meta.entity";
import {MulterModule} from "@nestjs/platform-express";
import {EntityClassOrSchema} from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import {AuthModule} from "@michalrakus/x-nest-server-lib/auth.module";
import {APP_GUARD} from "@nestjs/core";
import {JwtAuthGuard} from "@michalrakus/x-nest-server-lib/jwt-auth.guard";
import {XAuth, XEnvVar} from "@michalrakus/x-nest-server-lib/XEnvVars";
import {XUtils} from "@michalrakus/x-nest-server-lib/XUtils";
import {XAdvancedConsoleLogger} from "@michalrakus/x-nest-server-lib/XAdvancedConsoleLogger";
import {XFile} from "@michalrakus/x-nest-server-lib/x-file.entity";
import {XOptimisticLockingSubscriber} from "@michalrakus/x-nest-server-lib/XOptimisticLockingSubscriber";
import {XEnumEnum} from "@michalrakus/x-nest-server-lib/x-enum-enum.entity";
import {XEnum} from "@michalrakus/x-nest-server-lib/x-enum.entity";
import parseDatabaseUrl, {DatabaseConfig} from 'ts-parse-database-url';
import {XParam} from "@michalrakus/x-nest-server-lib/x-param.entity";
import {PostSubscriber} from "./PostSubscriber";
import {XUser} from "@michalrakus/x-nest-server-lib/x-user.entity";
import {Brand} from "./model/brand.entity";
import {Country} from "./model/country.entity";
import {Car} from "./model/car.entity";
import {Ride} from "./model/ride.entity";
import {CarReservation} from "./model/car-reservation.entity";
import {Client} from "./model/client.entity";

const entities: EntityClassOrSchema[] = [XBrowseMeta, XColumnMeta, XFile, XUser, XEnumEnum, XEnum, XParam,
  Brand, Country, Car, Ride, Client, CarReservation
];

// kedze metoda pouziva environment variables, musi byt zavolana az po inicializacii modulu ConfigModule
function createTypeOrmModuleOptions(entities: EntityClassOrSchema[]): TypeOrmModuleOptions {

  // zatial pouzijeme tento parseDatabaseUrl (pridali sme dependeciu na ts-parse-database-url)
  const dbConfig: DatabaseConfig = parseDatabaseUrl(XUtils.getEnvVarValue(XEnvVar.X_DATABASE_URL));
  //console.log(dbConfig);

  let type: "mysql" | "postgres";
  if (dbConfig.driver === "mysql") {
    type = "mysql";
  }
  else if (dbConfig.driver === "postgres") {
    type = "postgres";
  }
  else {
    throw "Unsupported driver = " + dbConfig.driver;
  }

  const typeOrmModuleOptions: TypeOrmModuleOptions = {
    type: type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    schema: dbConfig['schema'], // 'schema' je atribut z X_DATABASE_URL
    entities: entities,
    subscribers: [XOptimisticLockingSubscriber, PostSubscriber],
    synchronize: false,
    // logging: true sme nahradili custom loggerom - rozumne loguje parameter typu Buffer
    //logging: true,
    logger: new XAdvancedConsoleLogger(XUtils.getEnvVarValueBoolean(XEnvVar.X_LOG_SQL))
  };
  XUtils.setSchema(dbConfig['schema']);
  return typeOrmModuleOptions;
}

@Module({})
export class AppModule {
  // pouzivame metodku forRoot() + DynamicModule aby sme vedeli if-ovat pridavanie autorizacnych modulov
  static forRoot(configModule: DynamicModule): DynamicModule {

    const appModuleMetadata: DynamicModule = {
      imports: [
        configModule,
        // TypeOrmModule.forFeature(entities) je potrebny aby sme mohli injektovat Repository (vid carRepository v AppService)
        // TypeOrmModule.forRoot(typeOrmModuleOptions), TypeOrmModule.forFeature(entities) mozme presunut aj do XLibModule, zatial ich nechame tu
        TypeOrmModule.forRoot(createTypeOrmModuleOptions(entities)),
        TypeOrmModule.forFeature(entities),
        XLibModule.forRoot(),
        MulterModule.register(/*{dest: 'uploads/'}*/) // globalne nastavenie ako spracovavat subory, zatial nastavujeme na metodach controllera
      ],
      controllers: [AppController],
      providers: [
        AppService
      ],
      exports: [TypeOrmModule], // zevraj treba aby bola DB pristupna vo vsetkych moduloch, funguje vsak aj bez tohto
      module: AppModule
    };
    // ak nemame vypnutu autorizaciu, pridame autorizacne moduly
    if (XUtils.getEnvVarValue(XEnvVar.X_AUTH) !== XAuth.OFF) {
      appModuleMetadata.imports.push(AuthModule);
      appModuleMetadata.providers.push(
          {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
            //useClass: MsEntraIdAuthGuard // docasne na testovanie
          }
          //MsEntraIdStrategy // docasne na testovanie
      );
    }
    return appModuleMetadata;
  }
}

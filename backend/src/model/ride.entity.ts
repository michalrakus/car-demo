import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Country} from "./country.entity";
import {Car} from "./car.entity";

@Entity()
export class Ride {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'city_from', nullable: false})
    cityFrom: string;

    @Column({name: 'city_to', nullable: true})
    cityTo: string | null;

    @Column({nullable: true})
    km: number | null;

    @Column({name: 'fuel_price', type: 'numeric', precision: 12, scale: 2, nullable: true})
    fuelPrice: number | null;

    @Column({name: 'ride_date', type: 'date', nullable: true})
    rideDate: Date | null;

    @Column("timestamp without time zone", {name: 'ride_datetime', nullable: true})
    rideDatetime: Date | null;

    @Column({name: 'ride_boolean', nullable: false})
    rideBoolean: boolean;

    @ManyToOne(type => Car, car => car.rideList, {nullable: false})
    @JoinColumn({name: "car_id"})
    car: Car;

    @ManyToOne(type => Country, {nullable: true})
    @JoinColumn({name: "country_id"})
    country: Country | null;
}
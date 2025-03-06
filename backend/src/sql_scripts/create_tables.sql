-- app tables (create in schema car_demo)

CREATE TABLE brand (
	id SERIAL PRIMARY KEY,
	brand varchar NOT NULL
);

CREATE TABLE car (
	id SERIAL PRIMARY KEY,
	vin varchar NOT NULL,
	brand_string varchar,
    year int,
    color varchar,
    price DECIMAL(12,2),
    car_date DATE,
    car_datetime TIMESTAMP,
    car_boolean BOOLEAN NOT NULL default false,
    comment varchar,
	brand_id int,

	-- technical attributes
    modif_date TIMESTAMP,
    modif_x_user_id INT,
    version INT NOT NULL
);

CREATE TABLE country (
	id SERIAL PRIMARY KEY,
	code varchar NOT NULL,
	name varchar NOT NULL
);

CREATE TABLE ride (
	id SERIAL PRIMARY KEY,
	city_from varchar NOT NULL,
	city_to varchar,
    km int,
    fuel_price DECIMAL(12,2),
    ride_date DATE,
    ride_datetime TIMESTAMP,
    ride_boolean BOOLEAN NOT NULL default false,
	car_id int NOT NULL,
	country_id int
);

-- table car
ALTER TABLE car ADD FOREIGN KEY (brand_id) REFERENCES brand (id);
CREATE INDEX ON car (brand_id);

-- table ride
ALTER TABLE ride ADD FOREIGN KEY (car_id) REFERENCES car (id);
CREATE INDEX ON ride (car_id);
ALTER TABLE ride ADD FOREIGN KEY (country_id) REFERENCES country (id);
CREATE INDEX ON ride (country_id);

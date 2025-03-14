-- copied (temporary) from backend framework

-- DROP TABLE x_file;
-- DROP TABLE x_column_meta;
-- DROP TABLE x_browse_meta;
-- DROP TABLE x_user;

CREATE TABLE x_user (
	id serial PRIMARY KEY,
	username varchar(64) NOT NULL,
	password CHAR(60), -- not used if oauth2 used
    name varchar(128) NOT NULL, -- family name + surname
    enabled BOOLEAN NOT NULL default true,
    admin BOOLEAN NOT NULL default false,
    modif_date TIMESTAMP,
    modif_x_user_id int,
    version INT NOT NULL
);

-- postgresql vytvori defaultne nazvy constraintov a indexov (ak nespecifikujeme nazvy explicitne)
ALTER TABLE x_user ADD UNIQUE (username);
ALTER TABLE x_user ADD FOREIGN KEY (modif_x_user_id) REFERENCES x_user (id);
CREATE INDEX ON x_user (modif_x_user_id);

CREATE TABLE x_browse_meta (
	id serial PRIMARY KEY,
    entity varchar(64) NOT NULL,
    browse_id varchar(64),
    rows DECIMAL(6,0)
);

CREATE TYPE align AS ENUM('left','center','right');

CREATE TABLE x_column_meta (
	id serial PRIMARY KEY,
    field varchar(64) NOT NULL,
    header varchar(64),
    align align,
    dropdown_in_filter BOOLEAN NOT NULL default false,
    width varchar(16),
    column_order DECIMAL(3,0) NOT NULL,
	x_browse_meta_id int NOT NULL
);

ALTER TABLE x_column_meta ADD FOREIGN KEY (x_browse_meta_id) REFERENCES x_browse_meta (id);
CREATE INDEX ON x_column_meta (x_browse_meta_id);

-- bytea (bytearray) has limit 1 GB
-- size is informative field
-- file can be saved in file system (path + name is saved in field path_name, data is null) or can be saved direct in field data (path_name is null)
CREATE TABLE x_file (
    id serial PRIMARY KEY,
    name varchar(256) NOT NULL,
    size INT NOT NULL,
    path_name varchar(256),
    data bytea,
    modif_date TIMESTAMP,
    modif_x_user_id int
);

ALTER TABLE x_file ADD FOREIGN KEY (modif_x_user_id) REFERENCES x_user (id);
CREATE INDEX ON x_file (modif_x_user_id);

-- funkcia na odstranenie diakritiky pouzivana vo full-text search (treba ju volat: unaccent(<VARCHAR>))
--CREATE EXTENSION unaccent schema <schema>;

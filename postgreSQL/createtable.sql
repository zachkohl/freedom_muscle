SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'stargarnet' 
  AND pid <> pg_backend_pid();
--The above code forces closed all the connections (like the pool connection from Nodejs)
DROP DATABASE stargarnet;
CREATE DATABASE stargarnet;
\c stargarnet;
--This is where the schema for our database starts to get created
--To run code locally, enter command line: "psql -U postgres -d postgres -a -f postgreSQL/createtable.sql"
--PASSWORD: PASSWORD (for Zach's Postgres)
--\q to quit
--To enter psql from the normal command line: psql -U postgres 
--Username is postgres, that's what the above line means. 
--List databases: \l
--List tables in current database: \dt
--Connect to a specific database \c NAMEOFDATABASE
--Total number of tables: select count(*) from information_schema.tables;
--See http://www.postgresqltutorial.com/postgresql-create-table/
CREATE TABLE users (
 id serial PRIMARY KEY, 
 username VARCHAR (255) UNIQUE NOT NULL,
 email VARCHAR(255) NOT NULL,
 phone VARCHAR(255) NOT NULL,
 storedhash VARCHAR(255) NOT NULL,
 reviewtime TIME,
 lastupdate TIMESTAMPTZ,
 RoughAlarm TIMESTAMPTZ,
 remindercount int
);

SET timezone = 'America/Los_Angeles';

--YOU MUST use single quotes!
INSERT INTO users (username, email, phone, storedhash,reviewtime) VALUES ('zach', 'zkohl@stargarnet.io','+12087551332','$2b$10$oB66OtEH1ao6smvCxWih8O6cmE/9eKEyqwNOas6F1AxdLyBZICuPO','07:00');


--USED FOR SESSION MANAGEMENT: https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--END


CREATE TABLE goals (
 id serial PRIMARY KEY, 
 title VARCHAR (255) UNIQUE NOT NULL,
 username VARCHAR(255) NOT NULL,
 content TEXT,
 lastupdate TIMESTAMPTZ,
 lastreminder TIMESTAMPTZ,
 remindercount int
);

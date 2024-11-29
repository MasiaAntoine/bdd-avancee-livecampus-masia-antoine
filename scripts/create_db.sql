CREATE DATABASE company;

CREATE TABLE employees(
   id SERIAL,
   first_name VARCHAR(75)  NOT NULL,
   last_name VARCHAR(75)  NOT NULL,
   email VARCHAR(255)  NOT NULL,
   salary NUMERIC(15,2)   NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(email)
);

CREATE TABLE services(
   id SERIAL,
   name VARCHAR(255)  NOT NULL,
   office_number INTEGER NOT NULL,
   PRIMARY KEY(id)
);

CREATE TABLE manage(
   employee_id INTEGER,
   service_id INTEGER,
   start_date DATE NOT NULL,
   PRIMARY KEY(employee_id, service_id),
   FOREIGN KEY(employee_id) REFERENCES employees(id),
   FOREIGN KEY(service_id) REFERENCES services(id)
);
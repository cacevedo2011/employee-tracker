DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30) UNIQUE NOT NULL
);


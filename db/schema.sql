-- company_db schema

DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments(
                            department_id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(30) NOT NULL
);

CREATE TABLE roles(
                      role_id INT AUTO_INCREMENT PRIMARY KEY,
                      title VARCHAR(30) NOT NULL,
                      salary DECIMAL NOT NULL,
                      department_id INT NOT NULL,
                      FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE employees(
                          employee_id INT AUTO_INCREMENT PRIMARY KEY,
                          first_name VARCHAR(30) NOT NULL,
                          last_name VARCHAR(30) NOT NULL,
                          role_id INT NOT NULL,
                          manager_id INT,
                          FOREIGN KEY (role_id) REFERENCES roles(role_id),
                          FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);
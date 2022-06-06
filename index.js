const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const bluebird = require('bluebird');
const cTable = require('console.table');
require('dotenv').config();

async function displayMainMenu() {
    return await inquirer.prompt([
        {
            type: 'list',
            message: 'Please choose an option',
            name: 'menuOption',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Exit'],
        },
    ]);
}

async function addNewDepartment() {
    return await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter new department name',
            name: 'name',
        },
    ]);
}

async function insertDepartment(connection, newDepartment) {
    await connection.execute('INSERT INTO departments (name) VALUES (?)', [newDepartment]);
}

async function viewAllDepartments(connection) {
    return [rows, fields] = await connection.execute('SELECT * FROM departments;');
}

async function viewAllRoles(connection) {
    return [rows, fields] = await connection.execute('SELECT role_id, title, d.name as department, salary FROM roles r join departments d on r.department_id = d.department_id;');
}

async function viewAllEmployees(connection) {
    return [rows, fields] = await connection.execute('SELECT employee_id, first_name, last_name, r.title, d.name as department, salary, (SELECT CONCAT(first_name, \' \', last_name) FROM employees WHERE employees.employee_id = e.manager_id) AS manager FROM employees e JOIN roles r ON e.role_id = r.role_id JOIN departments d ON r.department_id = d.department_id;')
}

function displayResults(title, rows) {
    console.table(title, rows);
}

async function init() {
    const connection = await mysql.createConnection(
        {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            Promise: bluebird
        },
        console.log(`Connected to ${process.env.DB_NAME} database`)
    );
    let keepExecuting = true;

    while (keepExecuting) {
        let option = await displayMainMenu();
        let rows;

        switch (option.menuOption) {
            case 'View all departments':
                [rows] = await viewAllDepartments(connection);
                displayResults('Departments', rows);
                break;
            case 'View all roles':
                [rows] = await viewAllRoles(connection);
                displayResults('Roles', rows);
                break;
            case 'View all employees':
                [rows] = await viewAllEmployees(connection);
                displayResults('Employees', rows);
                break;
            case 'Add a department':
                const newDepartment = await addNewDepartment();
                await insertDepartment(connection, newDepartment.name);
                break;
            case 'Add a role':
                break;
            case 'Add an employee':
                break;
            case 'Update employee role':
                break;
            case 'Exit':
                keepExecuting = false;
                break;
        }

    }

    connection.end();
}

init().then(() => console.log('Thanks for using the application'));
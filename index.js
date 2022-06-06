const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const bluebird = require('bluebird');
const cTable = require('console.table');
require('dotenv').config();

async function displayMainMenu() {
    return await inquirer.prompt([
        {
            type: 'list',
            message: 'Please choose an option: ',
            name: 'menuOption',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Exit'],
        },
    ]);
}

async function addNewDepartment() {
    return await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter new department name: ',
            name: 'name',
        },
    ]);
}

async function addNewRole(departments){
    return await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter new role title: ',
            name: 'title',
        },
        {
            type: 'input',
            message: 'Enter new role salary: ',
            name: 'salary',
        },
        {
            type: 'list',
            message: 'Which department does the role belong to: ',
            name: 'department',
            choices: departments
        },
    ]);
}

async function addEmployee(roles, employees){
    return await inquirer.prompt([
        {
            type: 'input',
            message: 'Enter new employee\'s first name: ',
            name: 'first_name',
        },
        {
            type: 'input',
            message: 'Enter new employee\'s last name: ',
            name: 'last_name',
        },
        {
            type: 'list',
            message: 'What is the new employee\'s role? ',
            name: 'role',
            choices: roles,
        },
        {
            type: 'list',
            message: 'Who is the employee\'s manager: ',
            name: 'manager',
            choices: employees,
        },
    ]);
}

async function updateEmployeeRole(options, showRoles) {
    return await inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee\'s role do you want to update?',
            name: 'employee',
            choices: options,
            when: !showRoles,
        },
        {
            type: 'list',
            message: 'Which role do you want to assign to the selected employee?',
            name: 'role',
            choices: options,
            when: showRoles,
        },
    ]);
}

async function insertDepartment(connection, department) {
    await connection.execute('INSERT INTO departments (name) VALUES (?);', [department]);
}

async function insertRole(connection, role) {
    const [rows] = await connection.execute('SELECT department_id FROM departments WHERE name = ?;', [role.department]);
    await connection.execute('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);', [role.title, role.salary, rows[0].department_id]);
}

async function insertEmployee(connection, employee) {
    let manager_id;
    let [roles] = await connection.execute('SELECT role_id FROM roles WHERE title = ?', [employee.role]);
    const [first_name, last_name] = employee.manager.split(' ');
    if (employee.manager === 'None')
        manager_id = null;
    else {
        let[employees] = await connection.execute('SELECT employee_id FROM employees WHERE first_name = ? and last_name = ?;', [first_name, last_name]);
        manager_id = employees[0].employee_id;
    }
    await connection.execute('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [employee.first_name, employee.last_name, roles[0].role_id, manager_id]);
}

async function updateEmployeeRoleQuery(connection, employee, role) {
    const [first_name, last_name] = employee.split(' ');
    let [employees] = await connection.execute('SELECT employee_id FROM employees WHERE first_name = ? and last_name = ?;', [first_name, last_name]);
    let [roles] = await connection.execute('SELECT role_id FROM roles WHERE title = ?', [role]);
    await connection.execute('UPDATE employees SET role_id = ? WHERE employee_id = ?;', [roles[0].role_id, employees[0].employee_id]);
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

function mapRoles(rows) {
    let roles = rows.map(role => {
        return role.title;
    });

    return roles;
}

function mapEmployees(rows){
    let employees = rows.map(employee => {
        return employee.first_name.concat(' ', employee.last_name);
    });

    return employees;
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
        let roles;
        let employees;

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
                console.log('Added department tp the database');
                break;
            case 'Add a role':
                [rows] = await viewAllDepartments(connection);
                const departments = rows.map(department => {
                   return department.name;
                });
                const newRole = await addNewRole(departments);
                await insertRole(connection, newRole);
                break;
            case 'Add an employee':
                [rows] = await viewAllRoles(connection);
                roles = mapRoles(rows);
                [rows] = await viewAllEmployees(connection);
                employees = mapEmployees(rows);
                employees.push('None');
                const newEmployee = await addEmployee(roles, employees);
                await insertEmployee(connection, newEmployee);
                break;
            case 'Update employee role':
                [rows] = await viewAllEmployees(connection);
                employees = mapEmployees(rows);
                const updateEmployee = await updateEmployeeRole(employees, false);
                [rows] = await viewAllRoles(connection);
                roles = mapRoles(rows);
                const updateRole = await updateEmployeeRole(roles, true);
                await updateEmployeeRoleQuery(connection, updateEmployee.employee, updateRole.role);
                break;
            case 'Exit':
                keepExecuting = false;
                break;
        }

    }

    connection.end();
}

init().then(() => console.log('Thanks for using the application'));
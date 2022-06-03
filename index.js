const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require("fs");
require('dotenv').config()

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log(`Connected to ${process.env.DB_NAME} database`)
);

async function displayMainMenu() {
    return await inquirer.prompt([
        {
            type: 'list',
            message: 'Please choose an option',
            name: 'menuOption',
            choices: ['View all departments', 'View all roles', 'View all employess', 'Add a department', 'Add a role', 'Add an employee', 'Update employee role', 'Exit'],
        },
    ]);
}

async function init() {
    let keepExecuting = true;

    while (keepExecuting) {
        let option = await displayMainMenu();
        console.log(option);

        switch (option.menuOption) {
            case 'Exit':
                keepExecuting = false;
                break;
        }

    }
}

init().then(() => console.log('Thanks for using the application'));
const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require("fs");

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
const inquirer = require('inquirer');
const mysql = require('mysql2');

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
    while (true) {
        let option = await displayMainMenu();
        console.log(option);

        if (option.menuOption === 'Exit')
            break;
    }
}

init().then(() => console.log('Thanks for using the application'));
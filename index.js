const db = require('./db/database.js');
const connection = require('./db/connection.js')

const express = require('express');
const inquirer = require('inquirer');

//Connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    inquireQ();
});
//Prompt Questions
const inquireQ = () => {
    ask.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Roles",
            "Add Roles",
            "Delete Roles",
            "View Employees",
            "Add Employees",
            "Update Employee Roles",
            "Delete Employees",
            "View Departments",
            "Add Departments",
            "Delete Departments",
            "View Employees by Manager",
            "Update Employee by Manager",
            "View Budget by Department",
            "Add Department",
            "View Departments",
            "Delete Departments"
        ],
        name: "userFunction",
    },

    //Async
]).then(async res => {
    const userFunction = res.userFunction;

    //Begin
    try {
        switch (userFunction) {
            case "Add Department":
                const { deperment } = await ask.prompt({
                    type: "input",
                    message: "Please enter the department you wsh to add:",
                    name: "deperment"
                });
                await Db.addDeparment(department);
                console.log("Successfully added department!");
                const showDpt = await Db.getDepartments();
                printTable(showDpt);
                inquireQ();
                break;
            case "Add Role":
                const dept1 = await Db.getDepartments();
                const addRole = await ask.prompt([
                    {
                        type: "input",
                        message: "Please enter the role you wish to add:",
                        name: "title"
                    },
                    {
                        type: "input",
                        message: "Please enter the salary for this role:",
                        name: "salary",
                        validate: value => {
                            if (validator.isInt(value)) {
                                return true;
                            }
                            return "Please enter a valid salary ex:(30000)";
                        }
                    },
                    {
                        type: "list",
                        message: "Please select the department for this role:",
                        choices: dept1.map(deperment => ({ value: deperment.id, name: department.name })),
                        name: "department_id"
                    }]);
                await Db.addRole(addRole);
                console.log("Successfully added role!");
                const roleAdded = await Db.getRolesWithDepts();
                printTable(roleAdded);
                inquireQ();
                break;
            case "View Roles":
                const viewRoles = await Db.getRolesWithDepts();
                printTable(viewRoles);
                inquireQ();
                break;
            case "Add Employee":
                const Roles = await Db.getRoles();
                const Employees = await Db.getEmplyees();
                const employeeChoices = employees.map((employee) => ({
                    value: employee.id,
                    name: employee.last_name,
                }));
                employeeChoices.push({ value: null, name: "None" });
                const addEmp = await ask.prompt([
                    {
                        type: "input",
                        message: "Please enter employee's first name:",
                        name: "first_name"
                    },
                    {
                        type: "input",
                        message: "Please enter employee's last name:",
                        name: "last_name"
                    },
                    {
                        type: "list",
                        message: "Please select employee's role:",
                        choices: roles.map(role => ({ value: role.id, name: role.title })),
                        name: "role_id",
                    },
                    {
                        type: "list",
                        message: "Please select the manager for this employee:",
                        choices: employeeChoices,
                        name: "manager_id"
                    }
                ]);


const express = require('express');
const inquirer = require('inquirer');


//Files Needed
const Db = require('./db/database');
const connection = require('./db/connection');


//Importing Files
const ask = require('inquirer');
const util = require('util');
const validator = require('validator');
const cfonts = require('cfonts');
const { printTable } = require("console-table-printer");
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
const os = require('os');
const { beginTransaction } = require('./db/connection');

connection.query = util.promisify(connection.query);

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
            case "Add Roles":
                const dept1 = await Db.getDepartments();
                const addRoles = await ask.prompt([
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
                await Db.addRole(addRoles);
                console.log("Successfully added role!");
                const rolesAdded = await Db.getRolesWithDepts();
                printTable(rolesAdded);
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
                        choices: roles.map(roles => ({ value: roles.id, name: roles.title })),
                        name: "roles_id",
                    },
                    {
                        type: "list",
                        message: "Please select the manager for this employee:",
                        choices: employeeChoices,
                        name: "manager_id"
                    }
                ]);

await Db.addEmployee(addEmp);
                console.log("Successfully added employee!");
                const viewRes = await Db.getEmpsWithRoles();
                printTable(viewRes);
                inquireQ();
                break;
            case "View Employees":
                const viewEmps = await Db.getEmpsWithRoles();
                printTable(viewEmps);
                inquireQ();
                break;
            case "Update Employee Roles":
                const emps2 = await Db.getEmployees();
                const roles2 = await Db.getRoles();
                const joinQ = await ask.prompt([
                    {
                        type: "list",
                        message: "Please select the employee you wish to update:",
                        choices: emps2.map(employee => ({ value: employee.id, name: employee.last_name })),
                        name: "updateID"
                    },
                    {
                        type: "list",
                        message: "Please enter their new role id:",
                        choices: roles2.map(roles => ({ value: roles.id, name: roles.title })),
                        name: "updateRoleID"
                    }
                ])
                await Db.updateEmpRoles(joinQ);
                const join1 = await Db.getEmpsWithRoles();;
                printTable(join1);
                console.log("Successfully updated!");
                inquireQ();
                break;
            case "Update Employee Managers":
                const joinEmps = await Db.getEmpsWithRoles();
                printTable(joinEmps);
                const updateMngrs = await ask.prompt([
                    {
                        type: "list",
                        message: "Please select the employee who's manager you'd like to change:",
                        choices: joinEmps.map(employee => ({ value: employee.id, name: employee.last_name })),
                        name: "updateMngr"
                    },
                    {
                        type: "input",
                        message: "Please enter their new managers ID:",
                        name: "updateMngrID",
                        validate: (value) => {
                            if (validator.isInt(value)) {
                                return true;
                            }
                            return "Please enter valid manager id (#)";
                        },
                    },
                ]);
                await Db.updateEmpMngrs(updateMngrs);
                console.log("Employee's manager has been updated!");
                inquireQ();
                break;
            case "View Employees by Manager":
                const viewJoin = await Db.getEmpsWithRoles();
                printTable(viewJoin);
                const { viewMngrsEmps } = await ask.prompt(
                    {
                        type: "list",
                        message: "Please select the manager of whom you wish to view their employees:",
                        choices: viewJoin.map(employee => ({ value: employee.id, name: employee.last_name })),
                        name: "viewMngrsEmps"
                    }
                );
                const view = await Db.viewEmpsByMngr(viewMngrsEmps);
                if (view.length === 0) {
                    console.log("No employees under this person!");
                } else {
                    printTable(view);
                }
                inquireQ();
                break;
            case "Delete Department":
                const dept2 = await Db.getDepartments();
                const { deleteDept } = await ask.prompt({
                    type: "list",
                    message: "Please select the department you wish to delete:",
                    choices: dept2.map(department => ({ value: department.id, name: department.name })),
                    name: "deleteDept"
                });
                await Db.deleteDepartment(deleteDept);
                const viewRemain = await Db.getDepartments();
                printTable(viewRemain);
                inquireQ();
                break;
            case "Delete Role":
                const roles = await Db.getRoles();
                const { deleteRole } = await ask.prompt([
                    {
                        type: "list",
                        message: "Please select the role you wish to delete:",
                        choices: roles.map(roles => ({ value: roles.id, name: roles.title })),
                        name: "deleteRole"
                    }
                ]);
                await Db.deleteRole(deleteRole);
                const viewChange = await connection.query("SELECT * FROM roles");
                printTable(viewChange);
                inquireQ();
                break;
            case "Delete Employee":
                const empDel = await getEmployees();
                const { deleteEmp } = await ask.prompt({
                    type: "list",
                    message: "Please select the employee you wish to delete:",
                    choices: empDel.map(employee => ({ value: employee.id, name: employee.last_name })),
                    name: "deleteEmp"
                });
                await Db.deleteEmployee(deleteEmp);
                const viewEmpsLeft = await Db.getEmployees();
                printTable(viewEmpsLeft);
                inquireQ();
                break;
            case "View Budget by Department":
                const budgetDept = await Db.getDepartments();
                const { budget } = await ask.prompt({
                    type: "list",
                    message: "Please select the department's budget you wish to view",
                    choices: budgetDept.map(department => ({ value: department.id, name: department.name })),
                    name: "budget"
                });
                const budgetView = await Db.viewDeptBudget(budget);
                printTable(budgetView);
                let salary = budgetView.reduce((sum, row) => sum + row.salary, 0);
                console.log(`This departments budget is ${salary}`);
                inquireQ();
                break;
            case "Finish":
                connection.end();
                break;
            default:
                break;
            //end of switch
        }
        //end of try
    } catch (err) { console.log(err) };
});

};

cfonts.say("Employee Tracker!", {
    font: "pallet",
    align: "left",
    colors: ["yellow", "magenta"],
    background: "transparent",
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: "0",
    gradient: true,
    independentGradient: false,
    transitionGradient: false,
    env: "node",
});

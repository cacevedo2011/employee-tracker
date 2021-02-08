// This part of the code I got help from Damaris Campos and Michael Giddings

const connection = require('./connection');

class db {
    constructor(connection) {
        this.connection = connection;
    }
    getDepartments() {
        return this.connection.query("SELECT * FROM department");
    }
    // Michael Giddings help me in this part of the code and me and Damaris Campos took some of the inspiration of what
    // Michael said and made our own style.
    
    addDepartments(department) {
        return this.connection.query(
            "INSERT INTO department SET ?",
            {
                name: department,
            });
    }
    deleteDepartments(deleteDept) {
        return this.connection.query("DELETE FROM department WHERE id=? ", [deleteDept]);
    }
    viewDeptBudget(budget) {
        return this.connection.query("SELECT department.id, roles.id AS roles_id, roles.salary, employees.last_name FROM department INNER JOIN roles ON roles.department_id = department.id INNER JOIN employees ON employees.roles_id = roles.id WHERE department.id=?", [budget])
    }
    getRoles() {
        return this.connection.query("SELECT * FROM roles");
    }
    getRolesWithDepts() {
        return this.connection.query("SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles INNER JOIN department ON roles.department_id = department.id");
    }
    addRoles(addRoles) {
        return this.connection.query("INSERT INTO roles SET ?",
        {
            title: addRoles.title,
            salary: addRoles.salary,
            department_id: addRoles.department_id,
        });
    }

    deleteRoles(deleteRoles) {
        return this.connection.query("DELETE FROM roles WHERE id=?", [deleteRoles]);
    }    
    getEmployees() {
        return this.connection.query("SELECT * FROM employees");
    }
    getEmpsWithRoles() {
        return this.connection.query("SELECT employees.id, employees.first_name, employees.last_name, roles.title, manager_id FROM employees INNER JOIN roles ON employees.roles_id = roles.id");
    }
    addEmployees(addEmp) {
        return this.connection.query("INSERT INTO employees SET ?",
            {
                first_name: addEmp.first_name,
                last_name: addEmp.last_name,
                roles_id: addEmp.roles_id,
                manager_id: addEmp.manager_id
            });
    }
    viewEmpsByMngr(viewMngrsEmps) {
        return this.connection.query("SELECT * FROM employees WHERE?", [{
            manager_id: viewMngrsEmps
        }]);
    }
    updateEmpMngrs(updateEmpMngrs) {
        return this.connection.query("UPDATE employees SET ? WHERE ?", [{
            manager_id: updateEmpMngrs.updateMngrID,
        },
        {
            id: updateEmpMngrs.updateMngr
        }]);
    }
    updateEmpRoles(joinQ) {
        return this.connection.query("UPDATE employees SET ? WHERE ?", [{
            roles_id: joinQ.updateRolesID
        },
        {
            id: joinQ.updateID
        }]);
    }
    deleteEmployees(deleteEmp) {
        return this.connection.query("DELETE FROM employees WHERE id=?", [deleteEmp]);
    }
}

module.exports = new db(connection);
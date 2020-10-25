const connection = require('./connect');

class db {
    constructor(connection) {
        this.connection = connection;
    }
    getDepartments() {
        return this.connection.query("SELECT * FROM departments");
    }
    addDepartments(departments) {
        return this.connection.query(
            "INSERT INTO departments SET ?",
            {
                name: departments,
            });
    }
    deleteDepartments(deleteDept) {
        return this.connection.query("DELETE FROM departments WHERE id=? ", [deleteDept]);
    }
    viewDeptBudget(budget) {
        return this.connection.query("SELECT departments.id, roles.id AS roles_id, roles.salary, employees.last_name FROM departments INNER JOIN roles ON roles.departments_id = departments.id INNER JOIN employees ON employees.roles_id = roles.id WHERE departments.id=?", [budget])
    }
    getRoles() {
        return this.connection.query("SELECT * FROM roles");
    }
    getRolesWithDepts() {
        return this.connection.query("SELECT roles.id, roles.title, roles.salary, departments.name AS departments FROM roles INNER JOIN departments ON roles.departments_id = departments.id");
    }
    addRoles(addRoles) {
        return this.connection.query("INSERT INTO roles SET ?",
        {
            title: addRoles.title,
            salary: addRoles.salary,
            departments_id: addRoles.departments_id,
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
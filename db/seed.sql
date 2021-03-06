INSERT INTO department
    (name)

    VALUES
        ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

INSERT INTO roles
    (title, salary, department_id)

    VALUES
        ('Sales Lead', 100000, 1),
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 120000, 2),
        ('Account Manager', 160000, 3),
        ('Accountant', 125000, 3),
        ('Legal Team Lead', 250000, 4),
        ('Lawyer', 190000, 4);

INSERT INTO employees
    (first_name, last_name, roles_id, manager_id)

    VALUES
        ('Cristian', 'Acevedo', 1, 1),
        ('Damaris', 'Campos', 2, NULL),
        ('Josh', 'Carter', 3, 3),
        ('Michael', 'Napolitano', 4, 4),
        ('Marlon', 'Decosta', 2, 3);

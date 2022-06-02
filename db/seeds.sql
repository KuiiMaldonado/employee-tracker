INSERT INTO departments (name) VALUES
('Engineering'),
('Marketing'),
('Product Management'),
('Security');

INSERT INTO roles (title, salary, department_id) VALUES
('Software Developer', 6000, 1),
('Designer', 5000, 2),
('Product Manager', 4000, 3),
('Security Engineer', 5000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Cuitlahuac', 'Maldonado', 1, null),
('Dayana', 'Pantoja', 2, null),
('Gerardo', 'Cucumber', 3, null),
('Rene', 'Lopez', 4, null);
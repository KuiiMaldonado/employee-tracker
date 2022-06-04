INSERT INTO departments (name) VALUES
('Engineering'),
('Marketing'),
('Product Management'),
('Security');

INSERT INTO roles (title, salary, department_id) VALUES
('Senior Developer', 8000, 1),
('Software Developer', 6000, 1),
('Senior Designer', 7000, 2),
('Designer', 5000, 2),
('Product Manager', 4000, 3),
('Security Engineer', 5000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Cuitlahuac', 'Maldonado', 1, null),
('Michel', 'Osorio', 2, 1),
('Dayana', 'Pantoja', 3, null),
('Jose', 'Mata', 4, 3),
('Gerardo', 'Cucumber', 4, null),
('Rene', 'Lopez', 5, null);
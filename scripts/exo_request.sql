-- Nombre d'employés total
SELECT COUNT(*) AS total_employees FROM employees;

-- Moyenne des salaires de l'entreprise
SELECT AVG(salary) AS average_salary FROM employees;

-- Moyenne des salaires par service
SELECT s.name AS service_name, AVG(e.salary) AS average_salary
FROM employees e
JOIN services s ON e.service_id = s.id
GROUP BY s.name;

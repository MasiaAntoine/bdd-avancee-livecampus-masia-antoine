-- Classement du nombre d'employés par service
CREATE OR REPLACE FUNCTION employee_count_by_service()
RETURNS TABLE(service_name VARCHAR, employee_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT s.name, COUNT(e.id) AS employee_count
    FROM employees e
    JOIN services s ON e.service_id = s.id
    GROUP BY s.name
    ORDER BY employee_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Top 5 des services par masse salariale
CREATE OR REPLACE FUNCTION top_5_services_by_payroll()
RETURNS TABLE(service_name VARCHAR, total_salary NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT s.name, SUM(e.salary) AS total_salary
    FROM employees e
    JOIN services s ON e.service_id = s.id
    GROUP BY s.name
    ORDER BY total_salary DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Liste des managers et le service dont ils s'occupent
CREATE OR REPLACE FUNCTION list_managers_and_services()
RETURNS TABLE(manager_name VARCHAR, service_name VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT CONCAT(e.first_name, ' ', e.last_name)::VARCHAR AS manager_name, 
           s.name::VARCHAR AS service_name
    FROM manage m
    JOIN employees e ON m.employee_id = e.id
    JOIN services s ON m.service_id = s.id
    ORDER BY manager_name;
END;
$$ LANGUAGE plpgsql;

-- Écart entre le plus gros et le plus petit salaire
CREATE OR REPLACE FUNCTION salary_gap()
RETURNS NUMERIC AS $$
DECLARE
    max_salary NUMERIC;
    min_salary NUMERIC;
BEGIN
    SELECT MAX(salary) INTO max_salary FROM employees;
    SELECT MIN(salary) INTO min_salary FROM employees;
    RETURN max_salary - min_salary;
END;
$$ LANGUAGE plpgsql;


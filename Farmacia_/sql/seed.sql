INSERT INTO medicamento (nombre, marca, tipo, precio) VALUES 
('Paracetamol 500mg', 'Genfar', 'Pastilla', 15.50),
('Amoxicilina Suspensión', 'MK', 'Jarabe', 45.20),
('Salbutamol Inhalador', 'Glaxo', 'Inhalador', 85.00),
('Diclofenaco Gel', 'Voltaren', 'Crema', 32.50),
('Naphcon-A', 'Alcon', 'Gotas', 28.00);

INSERT INTO stock (id_medicamento, stock_minimo, stock_maximo, disponibilidad) VALUES 
(1, 100, 1000, 'disponible'),
(2, 10, 50, 'disponible'),
(3, 5, 20, 'agotado'),
(4, 15, 100, 'disponible'),
(5, 8, 40, 'disponible');

INSERT INTO lote (id_medicamento, fecha_vencimiento, cantidad_actual) VALUES 
(1, '2026-12-31', 500),
(1, '2026-05-15', 50),
(2, '2027-08-20', 25),
(4, '2027-01-10', 40),
(5, '2026-04-01', 10);
==============================================================================


SELECT:
--------------------------------------------------------------------
SELECT * FROM medicamento;

SELECT nombre, precio FROM medicamento;

==============================================================================

WHERE:
--------------------------------------------------------------------
SELECT * FROM medicamento WHERE tipo = 'Pastilla';

SELECT * FROM lote WHERE cantidad_actual > 100;

==============================================================================

ORDER BY
--------------------------------------------------------------------
SELECT * FROM medicamento ORDER BY precio DESC;

SELECT * FROM lote ORDER BY fecha_vencimiento ASC;

==============================================================================

JOIN:
--------------------------------------------------------------------
SELECT m.nombre, s.stock_minimo, s.stock_maximo 
FROM medicamento m 
JOIN stock s ON m.id_medicamento = s.id_medicamento;

SELECT m.nombre, l.cantidad_actual, l.fecha_vencimiento 
FROM medicamento m 
JOIN lote l ON m.id_medicamento = l.id_medicamento;
==============================================================================
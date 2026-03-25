-- >> SELECT: <<
-- ------------------------------------------------------------------
SELECT * FROM medicamento;

SELECT nombre, precio FROM medicamento;

-- ==============================================================================

-- >> WHERE: <<
-- ------------------------------------------------------------------
SELECT * FROM medicamento WHERE tipo = 'Pastilla';

SELECT * FROM lote WHERE cantidad_actual > 100;

-- ==============================================================================

-- >> ORDER BY <<
--------------------------------------------------------------------
SELECT * FROM medicamento ORDER BY precio DESC;

SELECT * FROM lote ORDER BY fecha_vencimiento ASC;

-- ==============================================================================

-- >> JOIN: <<
-- ------------------------------------------------------------------
SELECT m.nombre, s.stock_minimo, s.stock_maximo 
FROM medicamento m 
JOIN stock s ON m.id_medicamento = s.id_medicamento;

SELECT m.nombre, l.cantidad_actual, l.fecha_vencimiento 
FROM medicamento m 
JOIN lote l ON m.id_medicamento = l.id_medicamento;
-- ==============================================================================
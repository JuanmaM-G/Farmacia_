
CREATE DATABASE IF NOT EXISTS farmacia;
USE farmacia;


CREATE TABLE medicamento (
    id_medicamento INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    marca VARCHAR(100),
    tipo ENUM('Pastilla', 'Jarabe', 'Crema', 'Gotas', 'Inhalador') NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);


CREATE TABLE stock (
    id_stock INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_medicamento INT NOT NULL,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT DEFAULT 100,
    disponibilidad ENUM('disponible', 'vencido', 'agotado') DEFAULT 'disponible',
    FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento) ON DELETE CASCADE
);


CREATE TABLE lote (
    id_lote INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_medicamento INT(11) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cantidad_actual INT(11) NOT NULL DEFAULT 0,
    FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento) ON DELETE CASCADE
);

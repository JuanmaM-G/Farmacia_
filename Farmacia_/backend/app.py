from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import re

app = Flask(__name__)
app.secret_key = 'your_secret_key'
CORS(app)

# ===================================
db_config = {
    'host': 'localhost',
    'user': 'recu',
    'password': 'password',
    'database': 'farmacia'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

# =====================================================
# VALIDACIÓN BACKEND
# Reutilizable en POST y PUT.
# Retorna lista de errores; si está vacía, todo está bien.
# =====================================================
TIPOS_VALIDOS = {'Pastilla', 'Jarabe', 'Crema', 'Gotas', 'Inhalador'}

def validar_medicamento(data):
    errores = []

    nombre = data.get('nombre', '')
    marca  = data.get('marca', '')
    tipo   = data.get('tipo', '')
    precio = data.get('precio')

    # nombre: obligatorio, solo letras y espacios, mínimo 2 caracteres
    if not isinstance(nombre, str) or not nombre.strip():
        errores.append("El nombre es obligatorio.")
    elif len(nombre.strip()) < 2:
        errores.append("El nombre debe tener al menos 2 caracteres.")
    elif not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', nombre.strip()):
        errores.append("El nombre solo puede contener letras.")

    # marca: opcional, pero si viene debe ser solo letras
    if marca and not re.match(r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$', marca.strip()):
        errores.append("La marca solo puede contener letras.")

    # tipo: obligatorio, debe estar en el ENUM
    if not tipo:
        errores.append("El tipo es obligatorio.")
    elif tipo not in TIPOS_VALIDOS:
        errores.append(f"Tipo inválido. Valores permitidos: {', '.join(TIPOS_VALIDOS)}.")

    # precio: obligatorio, número positivo con máximo 2 decimales
    if precio is None or precio == '':
        errores.append("El precio es obligatorio.")
    else:
        try:
            precio_float = float(precio)
            if precio_float < 0:
                errores.append("El precio debe ser un número positivo.")
            elif round(precio_float, 2) != precio_float:
                errores.append("El precio puede tener máximo 2 decimales.")
        except (ValueError, TypeError):
            errores.append("El precio debe ser un número válido.")

    return errores

# ===================================

# GET — Obtener medicamentos, con filtro opcional por marca
@app.route('/api/Medicamento', methods=['GET'])
def get_medicamento():
    marca = request.args.get('marca', '')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if marca:
        cursor.execute('SELECT * FROM medicamento WHERE marca LIKE %s', (f'%{marca}%',))
    else:
        cursor.execute('SELECT * FROM medicamento')

    medicamentos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(medicamentos)

# ===================================

# POST — Insertar un nuevo medicamento
@app.route('/api/Medicamento', methods=['POST'])
def add_medicamento():
    data = request.get_json()

    # Valida antes de tocar la base de datos
    errores = validar_medicamento(data)
    if errores:
        return jsonify({'errores': errores}), 400

    nombre = data.get('nombre').strip()
    marca  = data.get('marca', '').strip()
    tipo   = data.get('tipo')
    precio = round(float(data.get('precio')), 2)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO medicamento (nombre, marca, tipo, precio) VALUES (%s, %s, %s, %s)',
            (nombre, marca, tipo, precio)
        )
        conn.commit()
        nuevo_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return jsonify({'message': 'Medicamento agregado', 'id_medicamento': nuevo_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===================================

# PUT — Actualizar un medicamento por id
@app.route('/api/Medicamento/<int:id>', methods=['PUT'])
def update_medicamento(id):
    data = request.get_json()

    # Reutiliza la misma función de validación
    errores = validar_medicamento(data)
    if errores:
        return jsonify({'errores': errores}), 400

    nombre = data.get('nombre').strip()
    marca  = data.get('marca', '').strip()
    tipo   = data.get('tipo')
    precio = round(float(data.get('precio')), 2)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE medicamento SET nombre=%s, marca=%s, tipo=%s, precio=%s WHERE id_medicamento=%s',
            (nombre, marca, tipo, precio, id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Medicamento actualizado'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===================================

# DELETE — Eliminar un medicamento por id
@app.route('/api/Medicamento/<int:id>', methods=['DELETE'])
def delete_medicamento(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM medicamento WHERE id_medicamento=%s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Medicamento eliminado'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===================================
if __name__ == '__main__':
    app.run(debug=True)  # Cambiar a FALSE en produccion
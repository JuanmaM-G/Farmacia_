from flask import Flask, jsonify, request, session
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
app.secret_key = 'your_secret_key'

CORS(app)

# ===================================
# Diccionario de datos
db_config = {
    'host': 'localhost',
    'user': 'recu',
    'password': 'password',
    'database': 'farmacia'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)
# ===================================

# GET — Obtener todos los medicamentos
@app.route('/api/Medicamento', methods=['GET'])
def get_medicamento():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM medicamento')
    medicamento = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(medicamento)

# ===================================

# POST — Insertar un nuevo medicamento
@app.route('/api/Medicamento', methods=['POST'])
def add_medicamento():
    data = request.get_json()

    nombre = data.get('nombre')
    marca  = data.get('marca')
    tipo   = data.get('tipo')
    precio = data.get('precio')

    # Validación básica de campos obligatorios
    if not nombre or not tipo or precio is None:
        return jsonify({'error': 'nombre, tipo y precio son obligatorios'}), 400

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
if __name__ == '__main__':
    app.run(debug=True)  # Cambiar a FALSE en produccion
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
if __name__ == '__main__':
    app.run(debug=True) #Cambiar a FALSE en produccion
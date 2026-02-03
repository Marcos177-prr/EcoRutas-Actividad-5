from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Almacenamiento temporal de puntos (Actividad 3)
puntos_guardados = []

@app.route('/')
def home():
    # Renderiza la Landing Page (Actividad 1)
    return render_template('index.html')

@app.route('/mapa')
def mapa():
    # Renderiza el mapa interactivo (Actividades 2, 3 y 4)
    return render_template('mapa.html')

@app.route('/guardar_punto', methods=['POST'])
def guardar_punto():
    data = request.json
    puntos_guardados.append(data)
    # Simulamos éxito para el feedback visual (Actividad 3)
    return jsonify({"status": "success", "message": "¡Punto guardado en EcoRutas!", "data": data})

if __name__ == '__main__':
    app.run(debug=True)
from openai import OpenAI
from flask import Flask, send_from_directory, request, jsonify, Response
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app) # Habilita CORS para todas las rutas

# Ruta para servir el index.html desde la carpeta dist
@app.route('/',  methods=["GET",'POST'])
def serve_index():
    return send_from_directory('dist', 'index.html')

# Ruta para servir los archivos estáticos generados
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('dist', path)

client = OpenAI(
    base_url = 'http://localhost:11434/v1',
    api_key='ollama', # required, but unused
)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Credenciales ficticias sin base de datos
    if username == "admin" and password == "123456":
        return jsonify({"success": True, "user": username, "token": "mock-jwt-token-xyz123"}), 200
    else:
        return jsonify({"success": False, "message": "Credenciales inválidas"}), 401

@app.route('/analizar-riesgos', methods=['POST'])
def analizar_riesgos():
    data = request.get_json()  # Obtener datos JSON enviados al endpoint
    activo = data.get('activo')  # Extraer el valor del activo
    if not activo:
        return jsonify({"error": "El campo 'activo' es necesario"}), 400
    
    riesgos, impactos, niveles = obtener_riesgos(activo)
    return jsonify({"activo": activo, "riesgos": riesgos, "impactos": impactos, "niveles": niveles})

@app.route('/sugerir-tratamiento', methods=['POST'])
def sugerir_tratamiento():
    data = request.get_json()  # Obtener datos JSON enviados al endpoint
    activo = data.get('activo')  # Extraer el valor del activo
    riesgo = data.get('riesgo')  # Extraer el valor del riesgo
    impacto = data.get('impacto')  # Extraer el valor del impacto

    # Verificar que todos los campos necesarios están presentes
    if not activo or not riesgo or not impacto:
        return jsonify({"error": "Los campos 'activo', 'riesgo' e 'impacto' son necesarios"}), 400

    # Combinar riesgo e impacto para formar la entrada completa para obtener_tratamiento
    entrada_tratamiento = f"Activo: {activo}; Riesgo: {riesgo}; Impacto: {impacto}"
    tratamiento = obtener_tratamiento(entrada_tratamiento)
    
    return jsonify({"activo": activo, "riesgo": riesgo, "impacto": impacto, "tratamiento": tratamiento})


def obtener_tratamiento( entrada ):
    response = client.chat.completions.create(
    model="llama2:7b",
    messages=[
    {"role": "system", "content": "Eres un Auditor Senior de Sistemas certificado en CISA e ISO 27001. Tu tarea es proporcionar una 'Recomendación' técnica, detallada y profesional para mitigar riesgos. Debes mencionar controles específicos (ej. Anexo A de ISO 27001) y ser muy descriptivo sobre las acciones a tomar (máximo 300 caracteres)."},
    {"role": "user", "content": "Activo: Servidor; Riesgo: Acceso no autorizado; Condición: Falta de MFA en cuentas administrativas."},
    {"role": "assistant",  "content": "Implementar un sistema de Autenticación de Múltiples Factores (MFA) siguiendo el control A.5.15. Además, restringir el acceso remoto mediante listas blancas de IP y realizar revisiones trimestrales de privilegios para asegurar el cumplimiento del principio de menor privilegio." },
    {"role": "user", "content": entrada }
    ]
    )
    return response.choices[0].message.content

def obtener_riesgos( activo ):
    response = client.chat.completions.create(
    model="llama2:7b",
    messages=[
    {"role": "system", "content": "Eres un Auditor Senior de Sistemas con 20 años de experiencia. Para el activo dado, genera un análisis de riesgo profundo y técnico. El formato debe ser estrictamente: **Riesgo**: (Título técnico) | **Condición**: (Descripción detallada de la vulnerabilidad, la amenaza y el impacto potencial en el negocio) | **Nivel**: (Baja, Media o Alta)."},
    {"role": "user", "content": "Base de Datos de Clientes"},
    {"role": "assistant",  "content": "**Riesgo**: Fuga de Información por Inyección de Código (SQLi) | **Condición**: Se detectó que las aplicaciones web no sanitizan adecuadamente las entradas del usuario, permitiendo que un atacante ejecute comandos maliciosos. Esto compromete la confidencialidad de la información sensible del cliente y expone al banco a sanciones legales y pérdida reputacional severa. | **Nivel**: Alta"},
    {"role": "user", "content": activo }
  ]
)
    answer = response.choices[0].message.content
    try:
        partes = answer.split("|")
        riesgo = partes[0].replace("**Riesgo**:", "").strip()
        condicion = partes[1].replace("**Condición**:", "").strip()
        nivel = partes[2].replace("**Nivel**:", "").strip()
        return [riesgo], [condicion], [nivel]
    except:
        return ["Riesgo no identificado"], ["Condición no definida"], ["Media"]

#riesgos, impactos = obtener_riesgos("mi telefono movil")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="5500")
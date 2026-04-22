# Informe de Auditoría de Sistemas - Examen de la Unidad I

**Nombres y apellidos:** [NOMBRE DEL ESTUDIANTE]
**Fecha:** 22 de abril de 2026
**URL GitHub:** [URL DEL REPOSITORIO]

---

## 1. Proyecto de Auditoría de Riesgos

### Login
- **Evidencia:** 
  ![Captura del login](https://via.placeholder.com/600x400?text=Captura+de+Pantalla+Login+Ficticio)
  *(Descripción de la imagen: Interfaz de usuario mostrando el formulario de acceso con campos de usuario y contraseña, y un mensaje de éxito tras ingresar las credenciales 'admin/123456')*
- **Descripción:** Se implementó una funcionalidad de inicio de sesión ficticio que valida las credenciales mediante una petición POST al backend Flask. El servidor verifica el usuario y la contraseña de forma estática (sin base de datos) y retorna un token de sesión simulado.

### Motor de Inteligencia Artificial
- **Evidencia:** 
  ![Captura del código mejorado](https://via.placeholder.com/600x400?text=Captura+de+Codigo+Motor+IA)
  *(Descripción de la imagen: Fragmento de código en app.py mostrando los nuevos prompts del sistema alineados con ISO 27001 y la integración real con la API de Ollama/OpenAI)*
- **Descripción:** Se optimizó el motor de inteligencia artificial mediante el refinamiento de los *system prompts*, permitiendo que el sistema actúe como un Auditor Senior con conocimiento profundo en ISO 27001 y ISO 27005. Se reemplazaron los mocks del frontend por integraciones reales con el backend Flask y modelos LLM locales vía Ollama, logrando análisis técnicos detallados y recomendaciones precisas para cada activo.

---

## 2. Hallazgos

### Activo 1: Servidor de base de datos
- **Evidencia:** [Captura de pantalla de la tabla de riesgos en la aplicación]
- **Condición:** Se identificaron vulnerabilidades críticas en el servidor de base de datos que podrían permitir a un atacante acceder y modificar información confidencial del banco y sus clientes, incluyendo datos de cuentas bancarias y transacciones sensibles.
- **Recomendación:** Realizar una revisión regular del servidor de base de datos. Implementar un programa de *penetration testing* para identificar vulnerabilidades. Establecer políticas rigurosas para el manejo de cambios y realizar capacitaciones regulares al personal técnico.
- **Riesgo:** Alto

### Activo 2: API Transaccionales
- **Evidencia:** [Captura de pantalla de la tabla de riesgos en la aplicación]
- **Condición:** Falta de validación adecuada de la integridad de las transacciones, permitiendo que un atacante realice transacciones fraudulentas, lo que resultaría en pérdidas económicas significativas y perjuicio a los clientes.
- **Recomendación:** Implementar un control de validación basado en la norma ISO 27001 (A.5.6.1.), utilizando algoritmos de firma digital y criptografía. Realizar revisiones periódicas de las configuraciones de la API para garantizar un nivel de confianza adecuado.
- **Riesgo:** Alto

### Activo 3: Firewall Perimetral
- **Evidencia:** [Captura de pantalla de la tabla de riesgos en la aplicación]
- **Condición:** El firewall perimetral no protege adecuadamente directorios críticos del sistema, permitiendo que atacantes obtengan información sensible, comprometiendo la confidencialidad de los datos del cliente y la seguridad de las operaciones.
- **Recomendación:** Aumentar el rango de protección del firewall para abarcar directorios críticos siguiendo el control A.12.1.3. Implementar controles de acceso basados en niveles de autorización y establecer políticas consistentes para la gestión de derechos de usuario.
- **Riesgo:** Alto

### Activo 4: Registros de Auditoría
- **Evidencia:** [Captura de pantalla de la tabla de riesgos en la aplicación]
- **Condición:** Los registros del sistema no se mantienen actualizados ni precisos, lo que impide evaluar el rendimiento y tomar decisiones informadas. Esto expone al banco a sanciones legales y perjuicio económico debido a la falta de trazabilidad.
- **Recomendación:** Mantener un sistema de gestión de registros adecuado según el control A.5.13. Incluir monitoreo y verificación periódica de entradas y salidas, proporcionar recursos para el uso adecuado de los mismos y realizar auditorías periódicas para evaluar la eficacia del sistema.
- **Riesgo:** Alto

### Activo 5: VPN Corporativa
- **Evidencia:** [Captura de pantalla de la tabla de riesgos en la aplicación]
- **Condición:** La configuración de la VPN no cumple con los estándares de seguridad, permitiendo que un atacante exterior intercepte y divulgue información personal y financiera confidencial de los clientes.
- **Recomendación:** Auditar la configuración de la VPN para garantizar el cumplimiento con estándares internacionales (ISO 27001, NIST SP 800-53). Implementar autenticación multifactor (MFA) y cifrado robusto de red para proteger la información frente a intercepciones.
- **Riesgo:** Medio

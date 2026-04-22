# Informe de Auditoría de Sistemas - Examen de la Unidad I

**Nombres y apellidos:** Elvis Ronald Leyva Sardon

**Fecha:** 22 de abril de 2026

**URL GitHub:** https://github.com/elvisleyva49/EXUI_Auditoria.git

---

## 1. Proyecto de Auditoría de Riesgos

### Login
- **Evidencia:** 
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/7e018842-5351-473e-bad9-d16eead75c49" />

  *(Descripción de la imagen: Interfaz de usuario mostrando el formulario de acceso con campos de usuario y contraseña, y un mensaje de éxito tras ingresar las credenciales 'admin/123456')*
- **Descripción:** Se implementó una funcionalidad de inicio de sesión ficticio que valida las credenciales mediante una petición POST al backend Flask. El servidor verifica el usuario y la contraseña de forma estática (sin base de datos) y retorna un token de sesión simulado.

### Motor de Inteligencia Artificial
- **Evidencia:** 
<img width="1918" height="1073" alt="image" src="https://github.com/user-attachments/assets/ea57873d-c3ab-4642-ab11-82c6e1512d0c" />

  *(Descripción de la imagen: Fragmento de código en app.py mostrando los nuevos prompts del sistema alineados con ISO 27001 y la integración real con la API de Ollama/OpenAI)*
- **Descripción:** Se optimizó el motor de inteligencia artificial mediante el refinamiento de los *system prompts*, permitiendo que el sistema actúe como un Auditor Senior con conocimiento profundo en ISO 27001 y ISO 27005. Se reemplazaron los mocks del frontend por integraciones reales con el backend Flask y modelos LLM locales vía Ollama, logrando análisis técnicos detallados y recomendaciones precisas para cada activo.

---

## 2. Hallazgos

### Activo 1: Servidor de base de datos
- **Evidencia:** <img width="1704" height="353" alt="image" src="https://github.com/user-attachments/assets/39280cd6-a340-4978-a5c9-cf59d3733cc2" />

- **Condición:** Se identificaron vulnerabilidades críticas en el servidor de base de datos que podrían permitir a un atacante acceder y modificar información confidencial del banco y sus clientes, incluyendo datos de cuentas bancarias y transacciones sensibles.
- **Recomendación:** Realizar una revisión regular del servidor de base de datos. Implementar un programa de *penetration testing* para identificar vulnerabilidades. Establecer políticas rigurosas para el manejo de cambios y realizar capacitaciones regulares al personal técnico.
- **Riesgo:** Alto

### Activo 2: API Transaccionales
- **Evidencia:** <img width="1746" height="164" alt="image" src="https://github.com/user-attachments/assets/642a7213-9574-4d06-99e7-c7b1249f1e56" />

- **Condición:** Falta de validación adecuada de la integridad de las transacciones, permitiendo que un atacante realice transacciones fraudulentas, lo que resultaría en pérdidas económicas significativas y perjuicio a los clientes.
- **Recomendación:** Implementar un control de validación basado en la norma ISO 27001 (A.5.6.1.), utilizando algoritmos de firma digital y criptografía. Realizar revisiones periódicas de las configuraciones de la API para garantizar un nivel de confianza adecuado.
- **Riesgo:** Alto

### Activo 3: Firewall Perimetral
- **Evidencia:** <img width="1752" height="162" alt="image" src="https://github.com/user-attachments/assets/249d8e8c-244b-4c71-96d3-fbeae0eed2ed" />

- **Condición:** El firewall perimetral no protege adecuadamente directorios críticos del sistema, permitiendo que atacantes obtengan información sensible, comprometiendo la confidencialidad de los datos del cliente y la seguridad de las operaciones.
- **Recomendación:** Aumentar el rango de protección del firewall para abarcar directorios críticos siguiendo el control A.12.1.3. Implementar controles de acceso basados en niveles de autorización y establecer políticas consistentes para la gestión de derechos de usuario.
- **Riesgo:** Alto

### Activo 4: Registros de Auditoría
- **Evidencia:** <img width="1728" height="215" alt="image" src="https://github.com/user-attachments/assets/e4799f40-02ff-4012-a79b-4331efbd102b" />

- **Condición:** Los registros del sistema no se mantienen actualizados ni precisos, lo que impide evaluar el rendimiento y tomar decisiones informadas. Esto expone al banco a sanciones legales y perjuicio económico debido a la falta de trazabilidad.
- **Recomendación:** Mantener un sistema de gestión de registros adecuado según el control A.5.13. Incluir monitoreo y verificación periódica de entradas y salidas, proporcionar recursos para el uso adecuado de los mismos y realizar auditorías periódicas para evaluar la eficacia del sistema.
- **Riesgo:** Alto

### Activo 5: VPN Corporativa
- **Evidencia:** <img width="1733" height="193" alt="image" src="https://github.com/user-attachments/assets/2a32581b-123e-413b-875c-d2fd206d2043" />

- **Condición:** La configuración de la VPN no cumple con los estándares de seguridad, permitiendo que un atacante exterior intercepte y divulgue información personal y financiera confidencial de los clientes.
- **Recomendación:** Auditar la configuración de la VPN para garantizar el cumplimiento con estándares internacionales (ISO 27001, NIST SP 800-53). Implementar autenticación multifactor (MFA) y cifrado robusto de red para proteger la información frente a intercepciones.
- **Riesgo:** Medio

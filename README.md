# Nodo Waha para n8n

## Descripción
El nodo Waha permite la integración con la API de WhatsApp HTTP (WAHA) en n8n, facilitando la automatización de tareas relacionadas con WhatsApp.

## Configuración

### Credenciales
Para utilizar este nodo, necesitas configurar las credenciales de Waha API:

1. **API URL**: La URL base de tu API de WAHA (ej. https://wa.iaportafolio.com)
2. **API Key**: Tu clave de API para autenticación
3. **Session Name**: El nombre de la sesión de WhatsApp (por defecto es 'default')

### Recursos y Operaciones

El nodo Waha ofrece los siguientes recursos y operaciones:

1. **Chatting**
   - Send Text: Envía un mensaje de texto
   - Send Image: Envía una imagen

2. **Session**
   - Start: Inicia una nueva sesión
   - Stop: Detiene una sesión
   - Logout: Cierra la sesión
   - Me: Obtiene información sobre la cuenta autenticada
   - Sessions: Lista todas las sesiones

3. **Auth**
   - QR: Obtiene el código QR para autenticación

## Uso

### Enviar un mensaje de texto

1. Selecciona el recurso "Chatting"
2. Elige la operación "Send Text"
3. Proporciona el Chat ID (ej. 123456789@c.us)
4. Ingresa el texto del mensaje

### Iniciar una sesión

1. Selecciona el recurso "Session"
2. Elige la operación "Start"
3. Proporciona la URL del webhook para recibir eventos

### Obtener código QR

1. Selecciona el recurso "Auth"
2. Elige la operación "QR"

## Notas importantes

- Asegúrate de que la sesión esté iniciada antes de enviar mensajes.
- El Chat ID debe estar en el formato correcto (número@c.us para chats individuales, id@g.us para grupos).
- Para enviar imágenes, puedes proporcionar una URL o datos en base64.

## Solución de problemas

- Si experimentas problemas de autenticación, verifica que la API Key sea correcta.
- Si la URL de la API no funciona, asegúrate de que esté correctamente configurada en las credenciales.
- Para problemas con sesiones específicas, verifica que el nombre de la sesión sea correcto.

## Ejemplo de flujo de trabajo

1. Nodo Waha (Session - Start): Inicia la sesión de WhatsApp
2. Nodo Waha (Chatting - Send Text): Envía un mensaje de texto
3. Nodo Waha (Auth - QR): Obtiene el código QR si es necesario para la autenticación

Este flujo inicia una sesión, envía un mensaje y proporciona un código QR si se requiere autenticación adicional.

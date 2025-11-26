exports.handler = async function(event, context) {
  // Solo permitimos peticiones POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Obtenemos la llave desde las variables de entorno de Netlify
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "La API Key no está configurada en Netlify." }) 
    };
  }

  try {
    // Usamos el modelo más reciente gemini-2.5-flash-preview-09-2025
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error de Google: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: `Error interno del servidor: ${error.message}` }) 
    };
  }
};

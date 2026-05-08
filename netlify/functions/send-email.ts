import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // CORS setup in case the function is called cross-origin (though usually not needed if same origin)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers, status: 200 });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { headers, status: 405 });
  }

  try {
    const body = await req.json();
    
    // N'oubliez pas d'ajouter VITE_RESEND_API_KEY dans votre dashboard Netlify (Site Settings -> Environment Variables)
    const apiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      throw new Error("Clé API Resend introuvable sur le serveur.");
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      throw new Error(errorData.message || "Erreur lors de l'envoi de l'e-mail.");
    }

    const data = await resendResponse.json();
    return new Response(JSON.stringify(data), { headers, status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers,
      status: 400,
    });
  }
};

export const config: Config = {
  path: "/api/send-email",
};

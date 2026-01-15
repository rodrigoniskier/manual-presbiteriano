/* api/consultar.js */
export default async function handler(req, res) {
    // 1. Segurança: Permitir apenas método POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Pegar a chave das Configurações da Vercel (Variáveis de Ambiente)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: { message: "Chave de API não configurada no servidor." } });
    }

    try {
        const { prompt } = req.body;

        // 3. Chamar o Google Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 4. Devolver a resposta para o seu site
        res.status(200).json(data);

    } catch (error) {
        console.error("Erro na Vercel:", error);
        res.status(500).json({ error: { message: error.message } });
    }
}

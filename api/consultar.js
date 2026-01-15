/* api/consultar.js */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: { message: "Chave de API não configurada." } });
    }

    try {
        const { prompt } = req.body;

        // --- MUDANÇA DE MODELO AQUI ---
        // Opção 1 (Rápida - Recomendada): 'gemini-1.5-flash'
        // Opção 2 (Inteligente - Lenta): 'gemini-1.5-pro'
        // Opção 3 (A do seu PDF): 'gemini-3-pro-preview' (Cuidado: pode não estar ativa ainda e dar erro 404)
        
        const modelName = 'gemini-3-flash'; // <--- Mude aqui para testar outros

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("Erro na Vercel:", error);
        res.status(500).json({ error: { message: error.message } });
    }
}

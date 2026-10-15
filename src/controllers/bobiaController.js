const bobiaModel = require("../models/bobiaModel");

async function perguntar(req, res) {
    const pergunta = String(req.body && req.body.pergunta ? req.body.pergunta : "").trim();

    if (!pergunta) {
        return res.status(400).json({ erro: "Pergunta é obrigatória." });
    }

    try {
        const resultado = await bobiaModel.gerarResposta(pergunta);
        return res.json({ resultado });
    } catch (error) {
        console.error("Erro ao responder pergunta do BobIA:", error);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
}

module.exports = {
    perguntar
};

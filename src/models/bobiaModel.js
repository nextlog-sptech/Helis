const { GoogleGenAI } = require("@google/genai");

const chatIA = new GoogleGenAI({ apiKey: process.env.MINHA_CHAVE });

function gerarResposta(mensagem) {
    return chatIA.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Em um parágrafo responda: ${mensagem}`
    }).then(function (resposta) {
        console.log("Resposta BobIA:", resposta.text);
        console.log("Uso de tokens:", resposta.usageMetadata);
        return resposta.text;
    });
}

module.exports = {
    gerarResposta
};

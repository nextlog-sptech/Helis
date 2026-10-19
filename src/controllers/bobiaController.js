const bobiaModel = require("../models/bobiaModel");
var historico = [{}]
var prompt = `
`
async function perguntar(req, res) {
    console.log(req.body)
    const pergunta = String(req.body && req.body.pergunta ? req.body.pergunta : "").trim();

    if (!pergunta) {
        return res.status(400).json({ erro: "Pergunta é obrigatória." });
    }

    try {
        const msg = {pergunta:pergunta,horario:new Date}
        historico.push(msg)
        const resultado = await bobiaModel.gerarResposta(criarPrompt(pergunta));
        const retorno = {resposta:resultado,horario:new Date}
        historico.push(retorno)
        return res.json({ resultado });
    } catch (error) {
        console.error("Erro ao responder pergunta do BobIA:", error);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
}
function criarPrompt(pergunta){

return `
Você é a BobIA, assistente da NextLog, plataforma de gestão e análise logística.

Ajude usuários a utilizar o sistema, interpretar KPIs, identificar problemas operacionais e reduzir custos.

A NextLog oferece gestão de fretes e veículos, alocação inteligente, importação de planilhas XLSX, dashboards e análises de custos, quilometragem, mercadorias, clientes e desempenho.

Regras:
- Responda em português brasileiro, de forma natural, amigável e objetiva.
- Explique termos técnicos com simplicidade.
- Baseie análises apenas nos dados disponíveis; nunca invente informações.
- Diferencie fatos, hipóteses e sugestões.
- Se faltarem dados, informe o que é necessário.
- Recomende ações práticas quando pertinente.
- Ajuste o tamanho da resposta à pergunta.

Histórico: ${JSON.stringify(historico)}
Mensagem atual: ${pergunta}
`;
}

module.exports = {
    perguntar
};

var financasModel = require("../models/financasModel");

function validarEmpresa(req, res) {
    var empresaId = Number(req.params.empresaId);

    if (!Number.isInteger(empresaId) || empresaId <= 0) {
        res.status(400).send("Id da empresa inválido!");
        return null;
    }
    return empresaId;
}

function lerAno(req, res) {
    var ano = req.query.ano ? Number(req.query.ano) : new Date().getFullYear();

    if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) {
        res.status(400).send("Ano inválido!");
        return null;
    }
    return ano;
}

function responder(res, promessa) {
    promessa
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar os dados de finanças! Erro: ", erro.sqlMessage || erro.message);
            res.status(500).send("Erro ao buscar os dados de finanças. Tente novamente mais tarde.");
        });
}

function buscarKpis(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    responder(res, financasModel.buscarKpis(empresaId).then(function (resultado) {
        var kpis = resultado[0];
        var receitaBruta = Number(kpis.receitaBruta);
        var despesas = Number(kpis.despesas);

        return {
            receitaBruta: receitaBruta,
            despesas: despesas,
            rentabilidade: receitaBruta - despesas,
            qtdFretes: Number(kpis.qtdFretes)
        };
    }));
}

function buscarFaturamentoMensal(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    var ano = lerAno(req, res);
    if (ano == null) return;

    responder(res, financasModel.buscarFaturamentoMensal(empresaId, ano));
}

function buscarFretesPorFaixa(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    var ano = lerAno(req, res);
    if (ano == null) return;

    responder(res, financasModel.buscarFretesPorFaixa(empresaId, ano));
}

function buscarReceitaPorCliente(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    var ano = lerAno(req, res);
    if (ano == null) return;

    responder(res, financasModel.buscarReceitaPorCliente(empresaId, ano));
}

function buscarGastoPorVeiculo(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    responder(res, financasModel.buscarGastoPorVeiculo(empresaId));
}

module.exports = {
    buscarKpis,
    buscarFaturamentoMensal,
    buscarFretesPorFaixa,
    buscarReceitaPorCliente,
    buscarGastoPorVeiculo
};

var financasModel = require("../models/financasModel");

function validarEmpresa(req, res) {
    var empresaId = Number(req.params.empresaId);

    if (!Number.isInteger(empresaId) || empresaId <= 0) {
        res.status(400).send("Id da empresa inválido!");
        return null;
    }
    return empresaId;
}

// Lê ano e mês da query string; se não vierem, usa o mês atual
function lerAnoMes(req, res) {
    var hoje = new Date();
    var ano = req.query.ano ? Number(req.query.ano) : hoje.getFullYear();
    var mes = req.query.mes ? Number(req.query.mes) : hoje.getMonth() + 1;

    if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) {
        res.status(400).send("Ano inválido!");
        return null;
    }
    if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
        res.status(400).send("Mês inválido! Deve estar entre 1 e 12.");
        return null;
    }
    return { ano: ano, mes: mes };
}

function responder(res, promessa) {
    promessa
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar os dados de finanças! Erro: ", erro.sqlMessage || erro.message);
            res.status(500).send(erro.sqlMessage || erro.message || "Erro no servidor MySQL");
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

    var periodo = lerAnoMes(req, res);
    if (periodo == null) return;

    responder(res, financasModel.buscarFaturamentoMensal(empresaId, periodo.ano));
}

function buscarFretesPorFaixa(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    var periodo = lerAnoMes(req, res);
    if (periodo == null) return;

    responder(res, financasModel.buscarFretesPorFaixa(empresaId, periodo.ano, periodo.mes));
}

function buscarTopClientes(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    var periodo = lerAnoMes(req, res);
    if (periodo == null) return;

    responder(res, financasModel.buscarTopClientes(empresaId, periodo.ano, periodo.mes));
}

function buscarGastoPorVeiculo(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    var marca = req.query.marca ? String(req.query.marca) : null;
    var tipoVeiculo = req.query.tipo ? String(req.query.tipo) : null;

    responder(res, financasModel.buscarGastoPorVeiculo(empresaId, marca, tipoVeiculo));
}

function buscarFiltrosVeiculo(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    responder(res, financasModel.buscarFiltrosVeiculo(empresaId));
}

module.exports = {
    buscarKpis,
    buscarFaturamentoMensal,
    buscarFretesPorFaixa,
    buscarTopClientes,
    buscarGastoPorVeiculo,
    buscarFiltrosVeiculo
};

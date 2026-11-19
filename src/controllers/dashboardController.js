var dashboardModel = require("../models/dashboardModel");

function validarEmpresa(req, res) {
    var empresaId = Number(req.params.empresaId);

    if (!Number.isInteger(empresaId) || empresaId <= 0) {
        res.status(400).send("Id da empresa inválido!");
        return null;
    }
    return empresaId;
}

function tratarErro(res, erro) {
    console.log(erro);
    console.log("\nHouve um erro ao buscar os dados do dashboard! Erro: ", erro.sqlMessage || erro.message);
    res.status(500).send("Erro ao buscar os dados do dashboard. Tente novamente mais tarde.");
}

function buscarFretesPorEstado(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    dashboardModel.buscarFretesPorEstado(empresaId)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            tratarErro(res, erro);
        });
}

function buscarFretesPorPeriodo(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId == null) return;

    var qtdMeses = Number(req.query.meses) || 7;
    if (qtdMeses < 1 || qtdMeses > 12) {
        res.status(400).send("A quantidade de meses deve estar entre 1 e 12!");
        return;
    }

    dashboardModel.buscarFretesPorPeriodo(empresaId, qtdMeses)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            tratarErro(res, erro);
        });
}

module.exports = {
    buscarFretesPorEstado,
    buscarFretesPorPeriodo
};

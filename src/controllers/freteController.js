var freteModel = require("../models/freteModel");

function validarEmpresa(req, res) {
    var empresaId = Number(req.params.empresaId || req.query.empresaId);

    if (!Number.isInteger(empresaId) || empresaId <= 0) {
        res.status(400).json({ erro: "ID da empresa inválido!" });
        return null;
    }
    return empresaId;
}

function listar(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId === null) return;

    freteModel.listar(empresaId)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar fretes:", erro);
            res.status(500).json({ erro: "Erro ao buscar fretes no banco de dados." });
        });
}

function listarRecentes(req, res) {
    var empresaId = validarEmpresa(req, res);
    if (empresaId === null) return;

    var limite = Number(req.query.limite) || 6;

    freteModel.listarRecentes(empresaId, limite)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar fretes recentes:", erro);
            res.status(500).json({ erro: "Erro ao buscar fretes recentes no banco de dados." });
        });
}

module.exports = {
    listar,
    listarRecentes
};

var veiculoModel = require("../models/veiculoModel");

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

    veiculoModel.listar(empresaId)
        .then(function (resultado) {

            var veiculos = resultado.map(function (veiculo) {
                return {
                    id: veiculo.id,
                    nome: veiculo.nome,
                    placa: veiculo.placa,
                    marca: veiculo.marca,
                    tipo: veiculo.tipo,
                    bau: veiculo.bau,
                    frete: Number(veiculo.frete),
                    viagens: Number(veiculo.viagens),
                    km: Number(veiculo.km)
                };
            });

            res.status(200).json(veiculos);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar veículos:", erro);
            res.status(500).json({ erro: "Erro ao buscar veículos no banco de dados." });
        });
}

module.exports = {
    listar
};
var express = require("express");
var router = express.Router();

var financasController = require("../controllers/financasController");

router.get("/kpis/:empresaId", function (req, res) {
    financasController.buscarKpis(req, res);
});

router.get("/faturamento-mensal/:empresaId", function (req, res) {
    financasController.buscarFaturamentoMensal(req, res);
});

router.get("/faixa-valor/:empresaId", function (req, res) {
    financasController.buscarFretesPorFaixa(req, res);
});

router.get("/receita-clientes/:empresaId", function (req, res) {
    financasController.buscarReceitaPorCliente(req, res);
});

router.get("/gasto-veiculos/:empresaId", function (req, res) {
    financasController.buscarGastoPorVeiculo(req, res);
});

module.exports = router;

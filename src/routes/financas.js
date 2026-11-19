var express = require("express");
var router = express.Router();

var financasController = require("../controllers/financasController");

// KPIs: receita bruta, despesas, rentabilidade e quantidade de fretes
router.get("/kpis/:empresaId", function (req, res) {
    financasController.buscarKpis(req, res);
});

// Gráfico de barras: faturamento de cada mês do ano (?ano=2026)
router.get("/faturamento-mensal/:empresaId", function (req, res) {
    financasController.buscarFaturamentoMensal(req, res);
});

// Gráfico de rosca: fretes por faixa de valor, de cada mês do ano (?ano=2026)
router.get("/faixa-valor/:empresaId", function (req, res) {
    financasController.buscarFretesPorFaixa(req, res);
});

// Gráfico de rosca: receita por cliente, de cada mês do ano (?ano=2026)
router.get("/receita-clientes/:empresaId", function (req, res) {
    financasController.buscarReceitaPorCliente(req, res);
});

// Lista de gasto por veículo (os filtros são aplicados no front-end)
router.get("/gasto-veiculos/:empresaId", function (req, res) {
    financasController.buscarGastoPorVeiculo(req, res);
});

module.exports = router;

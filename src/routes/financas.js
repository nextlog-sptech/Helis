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

// Gráfico de rosca: quantidade de fretes por faixa de valor no mês (?ano=2026&mes=9)
router.get("/faixa-valor/:empresaId", function (req, res) {
    financasController.buscarFretesPorFaixa(req, res);
});

// Gráfico de rosca: top 5 clientes por receita no mês (?ano=2026&mes=9)
router.get("/top-clientes/:empresaId", function (req, res) {
    financasController.buscarTopClientes(req, res);
});

// Lista de gasto por veículo (?marca=Volvo&tipo=Truck)
router.get("/gasto-veiculos/:empresaId", function (req, res) {
    financasController.buscarGastoPorVeiculo(req, res);
});

// Opções dos selects de marca e modelo
router.get("/filtros-veiculo/:empresaId", function (req, res) {
    financasController.buscarFiltrosVeiculo(req, res);
});

module.exports = router;

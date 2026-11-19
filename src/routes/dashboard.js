var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

// Gráfico de barras: quantidade de fretes por estado (UF do destinatário)
router.get("/fretes-estado/:empresaId", function (req, res) {
    dashboardController.buscarFretesPorEstado(req, res);
});

// Gráfico de linha: quantidade de fretes por mês
router.get("/fretes-periodo/:empresaId", function (req, res) {
    dashboardController.buscarFretesPorPeriodo(req, res);
});

module.exports = router;

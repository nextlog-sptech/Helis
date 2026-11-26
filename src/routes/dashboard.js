var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/fretes-estado/:empresaId", function (req, res) {
    dashboardController.buscarFretesPorEstado(req, res);
});

router.get("/fretes-periodo/:empresaId", function (req, res) {
    dashboardController.buscarFretesPorPeriodo(req, res);
});
router.get("/tipos-bau/:empresaId", function (req, res) {
    dashboardController.buscarTiposBau(req, res);
});

router.get("/fretes-regiao/:empresaId", function (req, res) {
    dashboardController.buscarFretesPorRegiao(req, res);
});

router.get("/kpis/:empresaId", function (req, res) {
    console.log("a")
    dashboardController.buscarKpis(req, res);
});

module.exports = router;

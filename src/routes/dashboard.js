var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/fretes-estado/:empresaId", function (req, res) {
    dashboardController.buscarFretesPorEstado(req, res);
});

router.get("/fretes-periodo/:empresaId", function (req, res) {
    dashboardController.buscarFretesPorPeriodo(req, res);
});

module.exports = router;

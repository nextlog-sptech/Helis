var express = require("express");
var router = express.Router();

var freteController = require("../controllers/freteController");

router.get("/:empresaId", function (req, res) {
    freteController.listar(req, res);
});

router.get("/recentes/:empresaId", function (req, res) {
    freteController.listarRecentes(req, res);
});

module.exports = router;

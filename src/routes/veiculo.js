var express = require("express");
var router = express.Router();

var veiculoController = require("../controllers/veiculoController");

router.get("/:empresaId", function (req, res) {
    veiculoController.listar(req, res);
});

module.exports = router;